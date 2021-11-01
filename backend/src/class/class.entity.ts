import { Assignment } from "@/assignment/assignment.entity";
import { BaseEntity } from "@/utils/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: "class" })
export class Class extends BaseEntity {
  @Column({ type: "varchar", name: "invite_code", default: null, unique: true })
  inviteCode: string | null

  @Column({ name: 'code_expiration', default: null })
  codeExpiration: Date | null

  @Column({ type: "varchar" })
  name: string

  @OneToMany(() => Assignment, assignment => assignment.class)
  assignments: Assignment[]
}