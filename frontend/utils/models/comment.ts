import { User } from "next-auth";
import { Review } from "./review";

export interface Comment {
  id: string
  author: User,
  review: Review
  content: string
  createdAt: Date
}