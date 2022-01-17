import { GradeStruct } from './gradeStruct'
import { User } from './user'

export interface Class {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  inviteToken: string
  teachers: User[]
  students: User[]
  gradeStructure: GradeStruct[]
}
