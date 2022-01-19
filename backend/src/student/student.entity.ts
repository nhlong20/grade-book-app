import { Class, GradeStructure } from '@/class/class.entity'
import { Review } from '@/review/review.entity'
import { BaseEntity } from '@/utils/base.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm'

@Entity()
export class Student extends BaseEntity {
  @Column()
  name: string

  @Column({ unique: true })
  academicId: string

  @Column({ type: 'uuid', select: false })
  classId: string

  @ManyToOne(() => Class)
  @JoinColumn()
  class: Class

  @OneToMany(() => Grade, (grade) => grade.student, { onDelete: 'CASCADE' })
  grades: Grade[]
}

@Entity()
export class Grade extends BaseEntity {
  @ManyToOne(() => Student, (student) => student.grades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: Student

  @Column({ type: 'uuid' })
  studentId: string

  @ManyToOne(() => GradeStructure, (g) => g.grades, { onDelete: 'CASCADE' })
  @JoinColumn()
  struct: GradeStructure

  @Column({ type: 'uuid' })
  structId: string

  @Column({ nullable: true, default: null })
  point: number

  @Column({ default: false })
  expose: boolean

  @OneToOne(() => Review, (r) => r.grade)
  review: Review
}
