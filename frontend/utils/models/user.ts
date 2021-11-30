import { Class } from "./class";

export interface User {
  id: string
  name: string,
  email: string,
  role: string
  subscriptedClasses: Class[]
  ownerClasses: Class[]
}