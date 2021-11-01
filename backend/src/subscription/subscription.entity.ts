import { Class } from "@/class/class.entity";
import { User } from "@/user/user.entity";
import { BaseEntity } from "@/utils/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Subscription extends BaseEntity {
  @Column({ type: 'uuid', name: 'owner_id', select: false })
  ownerId: string

  @Column({ type: 'uuid', name: 'class_id', select: false })
  classId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn()
  owner: User

  @ManyToOne(() => Class, { onDelete: "CASCADE" })
  @JoinColumn()
  class: Class
}