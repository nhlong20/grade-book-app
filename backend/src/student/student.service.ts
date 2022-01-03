import { DTO } from '@/type'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Grade, Student } from './student.entity'
import { CsvParser, ParsedData } from 'nest-csv-parser'
import { AuthRequest } from '@/utils/interface'
import { Class, GradeStructure } from '@/class/class.entity'
import { parseAsync } from 'json2csv'
import { Duplex } from 'stream'

function bufferToStream(buffer: Buffer) {
  let duplexStream = new Duplex({encoding: 'utf-8'})
  duplexStream.push(buffer)
  duplexStream.push(null)
  return duplexStream
}

class UpdatePointEntity {
  id: string
  point: number
  internalId: string
}

class CreateStudentEntity {
  id: string
  name: string
}

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Class) private classRepo: Repository<Class>,
    @InjectRepository(GradeStructure)
    private structRepo: Repository<GradeStructure>,
    @InjectRepository(Grade) private gradeRepo: Repository<Grade>,
    private readonly csvParser: CsvParser,
  ) {}

  async sendDefaultTemplateToCreate() {
    const csv = await parseAsync([], { fields: ['id', 'name'] })
    return csv
  }

  async sendTemplateForScoring(classId: string) {
    const students = await this.studentRepo.find({
      where: { classId },
    })

    const csv = await parseAsync(
      students.map(({ academicId, name, id }) => ({
        id: academicId,
        name,
        internalId: id,
      })),
      { fields: ['internalId', 'id', 'name', 'point'] },
    )

    return csv
  }

  async sendScoreBoard(classId: string) {
    const [students, structs] = await Promise.all([
      this.studentRepo.find({ where: { classId } }),
      this.structRepo.find({ where: { classId } }),
    ])

    const grades = await this.gradeRepo
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.student', 'student', 'student.classId=:classId', {
        classId,
      })
      .getMany()

    const rawData = students.map(({ academicId, name, id }) => ({
      id: academicId,
      name,
      ...structs.reduce(
        (sum, curr) => ({
          ...sum,
          [curr.title]:
            grades.find(
              ({ structId, studentId }) =>
                id === studentId && structId === curr.id,
            )?.point || 'NA',
        }),
        {},
      ),
    }))

    const csv = await parseAsync(rawData, {
      fields: ['id', 'name', ...structs.map(({ title }) => title)],
    })

    return csv
  }

  async getGradeOfClass(classId: string) {
    let [students, clas] = await Promise.all([
      this.studentRepo.find({
        where: { classId },
        relations: ['grades', 'grades.struct'],
      }),
      this.classRepo.findOne({
        where: { id: classId },
        relations: ['students'],
      }),
    ])

    students = students.map(({ grades, ...rest }) => ({
      ...rest,
      userId: clas.students.find((s) => s.mssv === rest.academicId)?.id,
      grades: grades.reduce(
        (sum, current) => ({
          ...sum,
          [current.struct.id]: {
            point: current.point,
            id: current.id,
            expose: current.expose,
          },
        }),
        {},
      ),
    })) as any

    return students
  }

  async bulkCreateStudent(filBuffer: Buffer, classId: string, req: AuthRequest) {
    if (
      !(
        await this.classRepo.findOne({
          where: { id: classId },
          relations: ['teachers'],
        })
      ).teachers.some((t) => t.email === req.user.email)
    ) {
      throw new BadRequestException('You can create student in this class')
    }

    // Remove BOM in buffer 
    if (filBuffer[0] === 0xEF && filBuffer[1] === 0xBB && filBuffer[2] === 0xBF) {
      filBuffer = filBuffer.slice(3)
    }

    const stream = bufferToStream(filBuffer)

    let entities = (await this.csvParser.parse(
      stream,
      CreateStudentEntity,
      undefined,
      undefined,
      { strict: true, separator: ','},
    )) as ParsedData<CreateStudentEntity>

    await this.studentRepo.delete({ classId: classId });

    return this.studentRepo.save(
      entities.list
        .map(({ name, id }) => ({
          classId,
          name,
          academicId: id,
        })),
    )
  }

  async bulkUpdatePoint(file: Buffer, structId: string, req: AuthRequest) {
    const struct = await this.structRepo.findOne({
      where: { id: structId },
      relations: ['class', 'class.teachers'],
    })

    if (!struct) throw new BadRequestException('Struct does not exist')
    if (!struct.class.teachers.some(({ email }) => email === req.user.email)) {
      throw new BadRequestException(
        'You have no right to update point of this struct',
      )
    }

    const stream = bufferToStream(file)
    const entities = (await this.csvParser.parse(
      stream,
      UpdatePointEntity,
      undefined,
      undefined,
      { strict: true, separator: ',' },
    )) as ParsedData<UpdatePointEntity>

    const grades = await this.gradeRepo
      .createQueryBuilder('g')
      .where('g.structId=:structId', { structId })
      .leftJoinAndSelect('g.student', 'student', 'student.id IN(:...ids)', {
        ids: entities.list.map((e) => e.internalId),
      })
      .getMany()

    return this.gradeRepo.save([
      ...grades.map(({ point, student, ...rest }) => ({
        ...rest,
        student,
        point:
          entities.list.find((e) => e.id === student.academicId)?.point ||
          point,
      })),
      ...entities.list
        .filter((e) => grades.every((g) => g.student.id !== e.internalId))
        .map((e) => ({
          structId,
          studentId: e.internalId,
          point: e.point,
        })),
    ])
  }

  async updatePoint(id: string, dto: DTO.Student.UpdatePoint) {
    const grade = await this.gradeRepo.findOne({ where: { id } })
    if (!grade) throw new BadRequestException('Grade does not exist')

    return this.gradeRepo.save({
      ...grade,
      point: dto.point,
    })
  }

  async createPoint(dto: DTO.Student.CreatePoint) {
    if (
      await this.gradeRepo.findOne({
        where: { studentId: dto.studentId, structId: dto.structId },
      })
    )
      throw new BadRequestException('Grade existed')

    return this.gradeRepo.save(dto)
  }

  async expose(id: string, dto: DTO.Student.Expose) {
    const grade =
      id !== 'undefined'
        ? await this.gradeRepo.findOne({ where: { id } })
        : null
    return this.gradeRepo.save({
      ...(grade || dto),
      expose: true,
      point: grade?.point || 0,
    })
  }

  async batchExpose(dto: DTO.Student.BatchExpose) {
    const grades = await this.gradeRepo.find({
      where: { id: In(dto.ids), expose: false },
    })

    const missingIds = dto.studentIds.filter((id) =>
      grades.every((g) => g.studentId !== id),
    )

    return this.gradeRepo.save([
      ...grades.map((grade) => ({ ...grade, expose: true })),
      ...missingIds.map((id) => ({
        studentId: id,
        structId: dto.structId,
        expose: true,
        point: 0,
      })),
    ])
  }
}
