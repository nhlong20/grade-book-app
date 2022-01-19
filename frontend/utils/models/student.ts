import { Class } from "./class";
import { Review } from "./review";

export interface Student {
  id: string
  academicId: string
  name: string
  userId: string
  class: Class
  grades: {
    [structId: string]: {
      id: string
      point: string
      expose: boolean
      review: Review
    }
  }
}
