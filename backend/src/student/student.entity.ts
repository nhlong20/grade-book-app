import { Class, GradeStructure } from '@/class/class.entity'
import { BaseEntity } from '@/utils/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Student extends BaseEntity {
  @Column()
  name: string

  @Column()
  academicId: string

  @Column({ type: 'uuid', select: false })
  classId: string

  @ManyToOne(() => Class)
  @JoinColumn()
  class: Class

  @OneToMany(() => Grade, (grade) => grade.student)
  grades: Grade[]
}

@Entity()
export class Grade extends BaseEntity {
  @ManyToOne(() => Student, (student) => student.grades)
  @JoinColumn()
  student: Student

  @Column({ type: 'uuid', select: false })
  studentId: string

  @ManyToOne(() => GradeStructure)
  @JoinColumn()
  struct: GradeStructure

  @Column({ type: 'uuid', select: false })
  structId: string

  @Column({ nullable: true, default: null })
  point: number

  @Column({ default: false })
  expose: boolean
}
