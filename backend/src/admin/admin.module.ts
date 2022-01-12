import { Class } from '@/class/class.entity'
import { MailModule } from '@/mail/mail.module'
import { User } from '@/user/user.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Class]), MailModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
