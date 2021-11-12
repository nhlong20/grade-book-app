import { Assignment } from "@/assignment/assignment.entity";
import { Subject } from "@/subject/subject.entity";
import { User } from "@/user/user.entity";
import { BaseEntity } from "@/utils/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: "class" })
export class Class extends BaseEntity {
  @Column({ type: "varchar", name: "invite_code", default: null, unique: true })
  inviteCode: string | null

  @Column({ name: 'code_expiration', default: null })
  codeExpiration: Date | null

  @Column({ type: "varchar", unique: true })
  identityCode: string

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

  @Column({ type: 'varchar', default: null })
  academicYear: string

  @OneToMany(() => Assignment, assignment => assignment.class)
  assignments: Assignment[]

  @Column({ type: "uuid", select: false })
  subjectId: string

  @ManyToOne(() => Subject, s => s.classes)
  @JoinColumn()
  subject: Subject
}