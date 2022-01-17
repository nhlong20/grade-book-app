import { Class } from '@/class/class.entity'
import { Noti } from '@/noti/noti.entity'
import { BaseEntity } from '@/utils/base.entity'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm'

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ nullable: true, default: null })
  picture: string

  @Column({ type: 'varchar', nullable: true, default: null })
  phone: string

  @Column({ type: 'varchar', default: null })
  facebookId: string | null

  @Column({ type: 'varchar', default: null })
  googleId: string | null

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', select: false })
  password: string

  @Column({ type: 'varchar', default: null, nullable: true, unique: true })
  mssv: string

  @Column({ default: false })
  activated: boolean

  @Column({ default: null, nullable: true })
  activateToken: string | null

  @Column({ default: null, nullable: true })
  activateTokenExpiration: Date | null

  @Column({ default: null, nullable: true })
  resetPasswordToken: string | null

  @Column({ default: null, nullable: true })
  resetPasswordTokenExpiration: Date | null

  @Column({ default: false })
  disabled: boolean

  @Column({ default: false })
  isAdmin: boolean

  @ManyToMany(() => Class, (c) => c.teachers)
  ownerClasses: Class[]

  @ManyToMany(() => Class, (c) => c.students)
  subscriptedClasses: Class[]
  
  @ManyToMany(() => Noti, (n) => n.receivers)
  receivedNotifications: Noti[]

  @OneToMany(() => Noti, (n) => n.actor)
  notifications: Noti[]
}
