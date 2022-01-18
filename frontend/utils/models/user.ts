import { Class } from "./class";
import { Noti } from "./noti";

export interface User {
  id: string
  name: string,
  email: string,
  role: string,
  phone: string,
  mssv: string,
  subscriptedClasses: Class[]
  ownerClasses: Class[]
  receivedNotifications: Noti[]
}