import { User } from '@/user/user.entity'
import { BaseEntity } from '@/utils/base.entity'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'

@Entity({ name: 'class' })
export class Class extends BaseEntity {
  @Index({ fulltext: true })
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', default: null })
  description: string

  @ManyToMany(() => User, (u) => u.ownerClasses)
  @JoinTable()
  teachers: User[]

  @ManyToMany(() => User, (user) => user.subscriptedClasses)
  @JoinTable()
  students: User[]

  @OneToMany(() => GradeStructure, (gradeStructure) => gradeStructure.class)
  @JoinColumn()
  gradeStructure: GradeStructure[]
}

@Entity()
export class GradeStructure extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string

  @Column({ type: 'varchar' })
  detail: string

  @Column({ type: 'uuid', select: false })
  classId: string

  @Column({ default: false })
  isReturn: boolean

  @Column({ default: 0 })
  order: number

  @ManyToOne(() => Class, (clazz) => clazz.gradeStructure)
  class: Class
}

export enum CodeType {
  Student = 'student',
  Teacher = 'teacher',
}

@Entity()
export class Code extends BaseEntity {
  @Column({ type: 'varchar', array: true })
  emails: string[]

  @Column({ nullable: true, default: null })
  expire: Date

  @Column({ enum: CodeType, type: 'enum' })
  type: CodeType
}
