import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ACCESS_TOKEN_COOKIE_KEY } from './utils/constant'

const cookieExtractor = function (req: Request) {
  let token = null

  if (req && req.cookies) {
    token = req.cookies[ACCESS_TOKEN_COOKIE_KEY]
  }

  return token
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: any) {
    return payload
  }
}
