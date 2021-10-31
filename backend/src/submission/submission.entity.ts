import { User } from "@/user/user.entity";
import { BaseEntity } from "@/utils/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class Submission extends BaseEntity {
  @Column({ type: 'float' })
  score: number

  @Column({ type: 'uuid', name: 'owner_id', select: false })
  ownerId: string

  @OneToOne(() => User)
  @JoinColumn()
  owner: User
}