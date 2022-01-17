import { Grade } from '@/student/student.entity'
import { User } from '@/user/user.entity'
import { BaseEntity } from '@/utils/base.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm'

@Entity()
export class Noti extends BaseEntity {
  @ManyToOne(() => User, (u) => u.notifications)
  @JoinColumn() 
  sender: User

  @Column({ type: 'uuid' })
  senderId: string

  @OneToMany(() => User, (c) => c.noti)
  receivers: User[]

  @Column()
  title: string

  @Column()
  body: string

  @Column()
  sourceType: string

  @Column({ type: 'uuid'})
  sourceId: string
}
