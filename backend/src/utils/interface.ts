import { Request } from 'express';

export interface JwtPayload {
  sub: string
  iat: number
  email: string
  name: string
}

export interface AuthRequest extends Request {
  user: JwtPayload
}