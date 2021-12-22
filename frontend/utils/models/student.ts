export interface Student {
  id: string
  academicId: string
  name: string
  userId: string
  grades: {
    [structId: string]: {
      id: string
      point: string
      expose: boolean
    }
  }
}
