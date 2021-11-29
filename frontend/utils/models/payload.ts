export enum Role {
  User = 'user'
}

export interface JwtPayload {
  email: string
  iat: number
  id: string
  image: string | null
  name: string
  roles: Role
  sub: string
}