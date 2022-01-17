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
export class Review extends BaseEntity {
  @OneToMany(() => Comment, (c) => c.review)
  comments: Comment[]

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User

  @Column({ type: 'uuid' })
  ownerId: string

  @OneToOne(() => Grade, (g) => g.review, { onUpdate: 'CASCADE' })
  @JoinColumn()
  grade: Grade

  @Column({ type: 'uuid' })
  gradeId: string

  @Column()
  explanation: string

  @Column()
  expectedGrade: number

  @Column({ default: false })
  resolved: boolean

  @Column({ default: null, nullable: true })
  formerGrade: number | null
}

@Entity()
export class Comment extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn()
  author: User

  @Column({ type: 'uuid' })
  authorId: string

  @ManyToOne(() => Review, (r) => r.comments)
  @JoinColumn()
  review: Review

  @Column({ type: 'uuid' })
  reviewId: string

  @Column()
  content: string
}
