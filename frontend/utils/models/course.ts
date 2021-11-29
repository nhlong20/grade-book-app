import { User } from "./user";

export interface Course {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  teacher: User
}