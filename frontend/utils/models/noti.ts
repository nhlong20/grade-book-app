import { User } from "next-auth";
import { NotiMessage } from "./notiMessage";

export interface Noti {
  actor: User
  actorId: string
  receivers: User[]
  message: NotiMessage
}