import { Grade } from '@/student/student.entity'
import { User } from '@/user/user.entity'
import { BaseEntity } from '@/utils/base.entity'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'


@Entity()
export class NotiMessage extends BaseEntity {
  @OneToMany(() => Noti, (n) => n.message)
  @JoinColumn()
  noti: Noti[]

  @Column()
  title: string

  @Column()
  body: string

  @Column()
  sourceType: string

  @Column({ type: 'uuid' })
  sourceId: string
}


@Entity()
export class Noti extends BaseEntity {
  @ManyToOne(() => User, (u) => u.notifications)
  @JoinColumn()
  actor: User

  @Column({ type: 'uuid' })
  actorId: string

  @ManyToMany(() => User, (user) => user.receivedNotifications)
  @JoinTable()
  receivers: User[]

  @ManyToOne(() => NotiMessage, (n) => n.noti)
  message: NotiMessage

  @Column({ type: 'uuid' })
  messageId: string
}
