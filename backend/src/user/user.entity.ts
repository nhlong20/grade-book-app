import { Class } from '@/class/class.entity'
import { BaseEntity } from '@/utils/base.entity'
import { Column, Entity, ManyToMany } from 'typeorm'

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

  @Column({ type: 'varchar' })
  password: string

  @ManyToMany(() => Class, (c) => c.students)
  subscriptedClasses: Class[]
}
