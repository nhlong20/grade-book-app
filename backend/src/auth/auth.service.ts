import { User } from '@/user/user.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoginDto } from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import { compare, hash } from 'bcrypt'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { CookieOptions, Response, Request } from 'express'
import { JwtPayload } from '@/utils/interface'
import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
} from '@/utils/constant'
import { tryCatch } from '@/utils/functionalTryCatch'

const commonJwtSignOptions: JwtSignOptions = {
  algorithm: 'HS256',
  secret: process.env.JWT_SECRET,
}

const commonCookieOption: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async signup(dto: SignUpDto) {
    if (await this.checkExistence(dto.email))
      throw new BadRequestException('User already exists')

    await this.userRepo.save({
      ...dto,
      password: await hash(dto.password, 10),
    })
  }

  async login(dto: LoginDto, res: Response) {
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

    const accessToken = this.jwtService.sign(payload, {
      ...commonJwtSignOptions,
      expiresIn: '15m',
    })

    const refreshToken = this.jwtService.sign(
      { email: user.email },
      {
        ...commonJwtSignOptions,
        expiresIn: '14 days',
      },
    )

    res.cookie(ACCESS_TOKEN_COOKIE_KEY, accessToken, {
      ...commonCookieOption,
      maxAge: 15 * 60 * 1000, //15m
    })

    res.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
      ...commonCookieOption,
      maxAge: 14 * 24 * 60 * 60 * 1000, //2 weeks
    })

    return user
  }

  async refresh(req: Request, res: Response) {
    const token = req.cookies[REFRESH_TOKEN_COOKIE_KEY]
    if (!token) throw new BadRequestException('Token to refresh not found')

    const [payload, err] = tryCatch<{ email: string }>(() =>
      this.jwtService.verify(token, {
        algorithms: ['HS256'],
        secret: process.env.JWT_SECRET,
      }),
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

    const accessToken = this.jwtService.sign(newPayload, {
      ...commonJwtSignOptions,
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
