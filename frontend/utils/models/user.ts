import { Class } from "./class";

export interface User {
  id: string
  name: string,
  email: string,
  role: string,
  phone: string,
  mssv: string,
  subscriptedClasses: Class[]
  ownerClasses: Class[]
}