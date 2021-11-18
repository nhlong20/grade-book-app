import { User } from '@/user/user.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { compare, hash } from 'bcrypt'
import { Response } from 'express'
import { JwtPayload } from '@/utils/interface'
import {
  ACCESS_TOKEN_COOKIE_KEY,
} from '@/utils/constant'
import { DTO } from '@/type'
import * as jwt from 'jsonwebtoken'

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
      sub: user.id,
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1 day',
    })


    res.set(ACCESS_TOKEN_COOKIE_KEY, accessToken)
    return payload
  }


  async checkExistence(email: string) {
    const user = await this.userRepo.findOne({ email })

    return !!user
  }
}
