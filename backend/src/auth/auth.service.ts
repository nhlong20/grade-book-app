import { User } from '@/user/user.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { compare, hash } from 'bcrypt'
import { CookieOptions, Response, Request } from 'express'
import { JwtPayload } from '@/utils/interface'
import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
} from '@/utils/constant'
import { tryCatch } from '@/utils/functionalTryCatch'
import { DTO } from '@/type'
import * as jwt from 'jsonwebtoken'

const commonCookieOption: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>, // @Inject() private jwtService: JwtService,
  ) { }

  async signup(dto: DTO.Auth.SignUp) {
    if (await this.checkExistence(dto.email))
      throw new BadRequestException('User already exists')

    await this.userRepo.save({
      ...dto,
      password: await hash(dto.password, 10),
    })
  }

  async login(dto: DTO.Auth.Login, res: Response) {
    const user = await this.userRepo.findOne({ email: dto.email })

    if (!user) throw new BadRequestException('Email or password is wrong')
    if (!(await compare(dto.password, user.password)))
      throw new BadRequestException('Email or password is wrong')

    const payload: JwtPayload = {
      email: user.email,
      iat: Date.now(),
      name: user.name,
      role: user.role,
      sub: user.id,
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '15m',
    })

    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '14 days',
      },
    )

    res = res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken, {
      ...commonCookieOption,
      maxAge: 15 * 60 * 1000, //15m
    })

    res = res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
      ...commonCookieOption,
      maxAge: 14 * 24 * 60 * 60 * 1000, //2 weeks
    })

    return { user, accessToken, refreshToken }
  }

  async refresh(req: Request, res: Response) {
    const token = req.cookies[REFRESH_TOKEN_COOKIE_KEY]
    if (!token) throw new BadRequestException('Token to refresh not found')

    const [payload, err] = tryCatch<{ email: string }>(
      () =>
        jwt.verify(token, process.env.JWT_SECRET, {
          algorithms: ['HS256'],
        }) as any,
    )

    if (err) throw new BadRequestException('Token is not valid')

    const user = await this.userRepo.findOne({ email: payload.email })
    if (!user) throw new BadRequestException('Token is outdated')

    const newPayload: JwtPayload = {
      email: user.email,
      iat: Date.now(),
      name: user.name,
      role: user.role,
      sub: user.id,
    }

    const accessToken = jwt.sign(newPayload, process.env.JWT_SECRET, {
      expiresIn: '15m',
    })

    res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken, {
      ...commonCookieOption,
      maxAge: 15 * 60 * 1000, //15m
    })

    return user
  }

  async logout(res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_KEY)
    res.clearCookie(REFRESH_TOKEN_COOKIE_KEY)
  }

  async checkExistence(email: string) {
    const user = await this.userRepo.findOne({ email })

    return !!user
  }
}
