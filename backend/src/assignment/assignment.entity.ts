import { Class } from '@/class/class.entity'
import { BaseEntity } from '@/utils/base.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

@Entity()
export class Assignment extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string

  @Column({ name: 'due_date' })
  dueDate: Date

  @Column({ type: 'int', name: 'max_score', default: 10 })
  maxScore: number

  @Column({ type: 'float' })
  percentage: number

  @Column({ type: 'uuid', select: false })
  classId: string

  @ManyToOne(() => Class, (c) => c.assignments)
  class: Class
}
