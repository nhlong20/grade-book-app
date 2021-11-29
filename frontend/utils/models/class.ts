import { User } from "./user";

export interface Class {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  indentityCode: string
  description: string
  credit: number,
  semester: string
  academicYear: string
  department: string
  teacher: User[]
  students: User[]
}