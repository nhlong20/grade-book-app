import { SubmissionModule } from '@/submission/submission.module'
import { Subscription } from '@/subscription/subscription.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassController } from './class.controller'
import { Class } from './class.entity'
import { ClassService } from './class.service'

@Module({
  imports: [TypeOrmModule.forFeature([Class, Subscription]), SubmissionModule],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule { }
