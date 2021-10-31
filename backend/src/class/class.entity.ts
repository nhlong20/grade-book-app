import { Assignment } from "@/assignment/assignment.entity";
import { BaseEntity } from "@/utils/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: "class" })
export class Class extends BaseEntity {
  @Column({ type: "varchar" })
  code: string

  @Column({ name: 'code_expiration' })
  codeExpiration: Date

  @Column({ type: "varchar" })
  name: string

  @OneToMany(() => Assignment, assignment => assignment.class)
  assignments: Assignment[]
}