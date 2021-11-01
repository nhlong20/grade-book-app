import { Assignment } from '@/assignment/assignment.entity'
import { User } from '@/user/user.entity'
import { BaseEntity } from '@/utils/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

@Entity()
export class Submission extends BaseEntity {
  @Column({ type: 'float', default: 0 })
  score: number

  @Column({ type: 'uuid', name: 'owner_id', select: false })
  ownerId: string

  @OneToOne(() => User)
  @JoinColumn()
  owner: User

  @Column({ type: 'uuid', name: 'assignment_id', select: false })
  assignmentId: string

  @ManyToOne(() => Assignment)
  @JoinColumn()
  assignment: Assignment
}
