import { Role } from '@/user/user.entity'

export interface JwtPayload {
  sub: string
  iat: number
  role: Role[]
  email: string
  name: string
}
