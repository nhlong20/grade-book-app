import { Class } from "@/class/class.entity";
import { BaseEntity } from "@/utils/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Subject extends BaseEntity {
  @Column({ type: "varchar", unique: true })
  name: string

  @OneToMany(() => Class, c => c.subject)
  classes: Class[]
}