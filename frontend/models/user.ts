import { Base } from "./base"

export type User = Base & {
    name: string
    studentId: string | null
    email: string
    facebookId: string | null
    googleId: string | null
}