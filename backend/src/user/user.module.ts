import { User } from '@/user/user.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { MailModule } from '@/mail/mail.module'
import { Noti } from '@/noti/noti.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Noti]), MailModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule { }
