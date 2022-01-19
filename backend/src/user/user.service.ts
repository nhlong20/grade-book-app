import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { compare, hash } from 'bcrypt'
import { randomBytes } from 'crypto'
import { MailService } from '@/mail/mail.service'
import moment from 'moment'
import { Noti } from '@/noti/noti.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Noti) private notiRepo: Repository<Noti>,
    private mailService: MailService,
  ) {}

  async patch(req: AuthRequest, dto: DTO.User.UserPatching) {
    const user = await this.userRepo.findOne({
      where: { email: req.user.email },
    })
    if (!user) throw new BadRequestException('User does not exist')

    return this.userRepo.save({
      ...user,
      ...dto,
    })
  }

  getUserClasses(req: AuthRequest) {
    return this.userRepo.findOne({
      where: { email: req.user.email },
      relations: ['subscriptedClasses', 'ownerClasses'],
    })
  }

  async getUserNotifications(req: AuthRequest) {
    return this.notiRepo
      .find({
        relations: ['message', 'actor', 'receivers'],
      })
      .then((reviews) =>
        reviews.filter((r) =>
          r.receivers.some((user) => user.id === req.user.id),
        ),
      )
  }

  async changePassword(req: AuthRequest, dto: DTO.User.ChangePassword) {
    const user = await this.userRepo.findOne({ where: { id: req.user.id } })
    if (!user) throw new BadRequestException('User not found')

    if (await compare(dto.password, user.password))
      throw new BadRequestException('Password not match')

    return this.userRepo.save({
      ...user,
      password: await hash(dto.newPassword, 10),
    })
  }

  async requestResetpassword(req: AuthRequest) {
    const user = await this.userRepo.findOne({ where: { id: req.user.id } })
    if (!user) throw new BadRequestException('User not found')

    const token = randomBytes(48).toString('base64url')

    await this.mailService.sendResetPasswordEmail(user.email, token)
    return this.userRepo.save({
      ...user,
      resetPasswordToken: token,
      resetPasswordTokenExpiration: moment().add(3, 'hours').toDate(),
    })
  }

  async resetPassword(dto: DTO.User.ResetPassword) {
    const user = await this.userRepo.findOne({
      where: { resetPasswordToken: dto.token },
    })

    if (!user) throw new BadRequestException('User not found')
    if (moment().isAfter(user.resetPasswordTokenExpiration))
      throw new BadRequestException('Token expired')

    return this.userRepo.save({
      ...user,
      password: await hash(dto.password, 10),
      resetPasswordToken: null,
      resetPasswordTokenExpiration: null,
    })
  }

  async checkResetPasswordToken(token: string) {
    const user = await this.userRepo.findOne({
      where: { resetPasswordToken: token },
    })

    return !!user
  }
}
