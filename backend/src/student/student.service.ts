import { DTO } from '@/type'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Grade, Student } from './student.entity'

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Grade) private gradeRepo: Repository<Grade>,
  ) {}

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
