import { User } from '@/user/user.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { compare, hash } from 'bcrypt'
import { Response } from 'express'
import { AuthRequest, JwtPayload } from '@/utils/interface'
import { DTO } from '@/type'
import * as jwt from 'jsonwebtoken'
import { MailService } from '@/mail/mail.service'
import { randomBytes } from 'crypto'
import moment from 'moment'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async signup(dto: DTO.Auth.SignUp) {
    if (await this.checkExistence(dto.email))
      throw new BadRequestException('User already exists')

    const token = randomBytes(48).toString('base64url')

    // await this.mailService.sendActivationEmail(dto.email, token)
    await this.userRepo.save({
      ...dto,
      password: await hash(dto.password, 10),
      googleId: dto.googleId ? await hash(dto.googleId, 10) : null,
      activateToken: token,
      activateTokenExpiration: moment().add(5, 'hour').toDate(),
    })
  }

  async activate(dto: DTO.Auth.Activate) {
    const user = await this.userRepo.findOne({
      where: { activateToken: dto.token },
    })

    if (!user) throw new BadRequestException('User not found')
    if (moment().isAfter(user.activateTokenExpiration))
      throw new BadRequestException('Token expired')

    return this.userRepo.save({
      ...user,
      activated: true,
      activateTokenExpiration: null,
      activateToken: null,
    })
  }

  async resendActivateEmail(req: AuthRequest) {
    const user = await this.userRepo.findOne({ where: { id: req.user.id } })
    if (!user) throw new BadRequestException('User not found')

    const token = randomBytes(48).toString('base64url')
    await this.mailService.sendActivationEmail(user.email, token)

    return this.userRepo.save({
      ...user,
      activateToken: token,
      activateTokenExpiration: moment().add(5, 'hour').toDate(),
    })
  }

  async login(dto: DTO.Auth.Login, res: Response) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: dto.email })
      .getOne()

    if (!user) throw new BadRequestException('Email or password is wrong')
    if (!(await compare(dto.password, user.password)))
      throw new BadRequestException('Email or password is wrong')

    const payload: JwtPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
      mssv: user.mssv,
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1 day',
    })

    res.set('X-Access-Token', accessToken)
    return payload
  }

  async checkExistence(email: string) {
    const user = await this.userRepo.findOne({ email })

    return !!user
  }

  async loginByGoggle(dto: DTO.Auth.LoginByGoogle) {
    const user = await this.userRepo.findOne({ email: dto.email })

    if (!user) throw new BadRequestException('This account does not exist')

    if (!(await compare(dto.googleId, user.googleId)))
      throw new BadRequestException('This account does not exist')

    const payload: JwtPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
      mssv: user.mssv,
    }

    return payload
  }
}
