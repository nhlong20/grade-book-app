import { MailModule } from '@/mail/mail.module'
import { User } from '@/user/user.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassController } from './class.controller'
import { Assignment, Class, Code, GradeStructure } from './class.entity'
import { ClassService } from './class.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, User, Code, GradeStructure, Assignment]),
    MailModule,
  ],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule { }
