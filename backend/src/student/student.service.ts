import { DTO } from '@/type'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Grade, Student } from './student.entity'
import { CsvParser, ParsedData } from 'nest-csv-parser'
import { AuthRequest } from '@/utils/interface'
import { Class, GradeStructure } from '@/class/class.entity'
import { Response } from 'express'
import { parseAsync } from 'json2csv'
import { Duplex } from 'stream'

function toStream(buffer: Buffer) {
  let tmp = new Duplex()

  tmp.push(buffer)
  tmp.push(null)
  return tmp
}

class UpdatePointEntity {
  id: string
  point: number
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

  async sendTemplateForScoring(res: Response, classId: string) {
    const students = await this.studentRepo.find({
      where: { classId },
    })

    const csv = await parseAsync(
      students.map(({ academicId, name }) => ({
        id: academicId,
        name,
      })),
      { fields: ['id', 'name', 'point'] },
    )

    res.set('Content-Type', 'application/octet-stream')
    res.send(csv)
  }

  async sendScoreBoard(classId: string, res: Response) {
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

    res.set('Content-Type', 'application/octet-stream')
    res.send(csv)
  }

  async getGradeOfClass(classId: string) {
    let students = await this.studentRepo.find({
      where: { classId },
      relations: ['grades', 'grades.struct'],
    })

    students = students.map(({ grades, ...rest }) => ({
      ...rest,
      grades: grades.reduce(
        (sum, current) => ({
          ...sum,
          [current.struct.id]: { point: current.point, id: current.id },
        }),
        {},
      ),
    })) as any

    return students
  }

  async bulkCreateStudent(file: Buffer, classId: string, req: AuthRequest) {
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

    const stream = toStream(file)
    const entities = (await this.csvParser.parse(
      stream,
      CreateStudentEntity,
      undefined,
      undefined,
      { strict: true, separator: ',' },
    )) as ParsedData<CreateStudentEntity>

    return this.studentRepo.save(
      entities.list.map(({ name, id }) => ({
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

    const stream = toStream(file)
    const entities: UpdatePointEntity[] = (await this.csvParser.parse(
      stream,
      UpdatePointEntity,
    )) as any

    const grades = await this.gradeRepo
      .createQueryBuilder('g')
      .where('g.structId=:structId', { structId })
      .leftJoinAndSelect(
        'g.student',
        'student',
        'student.academicId IN(:...ids)',
        { ids: entities.map((e) => e.id) },
      )
      .getMany()

    return this.gradeRepo.save(
      grades.map(({ point, student, ...rest }) => ({
        ...rest,
        student,
        point:
          entities.find((e) => e.id === student.academicId)?.point || point,
      })),
    )
  }

  async updatePoint(id: string, dto: DTO.Student.UpdatePoint) {
    const grade = await this.gradeRepo.findOne({ where: { id } })
    if (!grade) throw new BadRequestException('Grade does not exist')

    return this.gradeRepo.save({
      ...grade,
      point: dto.point,
    })
  }

  async expose(id: string) {
    const grade = await this.gradeRepo.findOne({ where: { id, expose: false } })
    if (!grade) throw new BadRequestException('Grade does not exist')

    return this.gradeRepo.save({
      ...grade,
      expose: true,
    })
  }

  async batchExpose(dto: DTO.Student.BatchExpose) {
    const grades = await this.gradeRepo.find({
      where: { id: In(dto.ids), expose: false },
    })

    return this.gradeRepo.save(
      grades.map((grade) => ({ ...grade, expose: true })),
    )
  }
}
