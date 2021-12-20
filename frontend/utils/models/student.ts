export interface Student {
  id: string
  academicId: string
  name: string
  grades: {
    [structId: string]: {
      id: string
      point: string
    }
  }
}
