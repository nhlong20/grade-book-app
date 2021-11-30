import { Assignment } from "./assignment";
import { User } from "./user";

export interface Class {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  teachers: User[]
  students: User[]
  assignments: Assignment[]
}