import { User } from '@/user/user.entity'
import { GradeStructure } from '@/gradestructure/grade-structure.entity'
import { BaseEntity } from '@/utils/base.entity'
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm'

@Entity({ name: 'class' })
export class Class extends BaseEntity {
  @Index({ fulltext: true })
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', default: null })
  description: string

  @ManyToMany(() => User)
  @JoinTable()
  teachers: User[]

  @ManyToMany(() => User, (user) => user.subscriptedClasses)
  @JoinTable()
  students: User[]

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
