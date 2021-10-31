import { BaseEntity } from '@/utils/base.entity'
import { Column, Entity } from 'typeorm'

export enum Role {
  AD = 'admin',
  ST = 'student',
  TE = 'teacher'
}

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ enum: Role, type: "enum", array: true })
  role: Role[]
}
