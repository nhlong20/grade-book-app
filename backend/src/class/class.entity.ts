import { Subject } from "@/subject/subject.entity";
import { User } from "@/user/user.entity";
import { BaseEntity } from "@/utils/base.entity";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: "class" })
export class Class extends BaseEntity {
  @Column({ type: "varchar", unique: true })
  identityCode: string

  @Index({ fulltext: true })
  @Column({ type: "varchar" })
  name: string

  @Column({ type: "varchar", default: null })
  description: string

  @Column()
  credit: number

  @Column({ type: 'varchar' })
  semester: string

  @ManyToMany(() => User)
  @JoinTable()
  teachers: User[]

  @ManyToMany(() => User, user => user.subscriptedClasses)
  @JoinTable()
  students: User[]

  @Column({ type: 'varchar', default: null })
  academicYear: string

  @Column({ type: "uuid", select: false })
  subjectId: string

  @ManyToOne(() => Subject, s => s.classes)
  @JoinColumn()
  subject: Subject
}

export enum CodeType {
  Student = 'student',
  Teacher = 'teacher'
}

@Entity()
export class Code extends BaseEntity {
  @Column()
  emails: string[]

  @Column({ nullable: true, default: null })
  expire: Date

  @Column({ enum: CodeType, type: 'enum' })
  type: CodeType
}