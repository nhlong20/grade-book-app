import { User } from '@/user/user.entity'
import { GradeStructure } from '@/gradestructure/grade-structure.entity'
import { BaseEntity } from '@/utils/base.entity'
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToMany } from 'typeorm'

@Entity({ name: 'class' })
export class Class extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  identityCode: string

  @Index({ fulltext: true })
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', default: null })
  description: string

  @Column()
  credit: number

  @Column({ type: 'varchar' })
  semester: string

  @ManyToMany(() => User)
  @JoinTable()
  teachers: User[]

  @ManyToMany(() => User, (user) => user.subscriptedClasses)
  @JoinTable()
  students: User[]

  @Column({ type: 'varchar', default: null })
  academicYear: string

  @Column({ type: 'varchar' })
  department: string

  @OneToMany(() => GradeStructure, gradeStructure => gradeStructure.class)
  gradeStructure: GradeStructure[];
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
