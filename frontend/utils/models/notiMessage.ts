import { Noti } from "./noti";

export interface NotiMessage {
  id: string
  noti: Noti[]
  title: string
  body: string
  sourceType: string
  sourceId: string
  createdAt: Date
}