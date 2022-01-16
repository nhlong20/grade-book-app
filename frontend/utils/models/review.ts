import { User } from './user'
import { GradeStruct } from './gradeStruct'
import { Comment } from './comment'
import { Student } from './student'

export interface Review {
  comments: Comment[]
  owner: User
  grade: {
    student: Student
    struct: GradeStruct
    point: number
    expose: boolean
  }
  explanation: string
  expectedGrade: number
  resolved: boolean
  formerGrade: number | null
  id: string
  createdAt: Date
}
