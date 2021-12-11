import { Assignment } from "./assignment";
import { Class } from "./class";

export type GradeStruct = {
  id: string,
  title: string,
  detail: string,
  class: Class,
  order: number
  assignments: Assignment[]
}