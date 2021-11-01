import { SubmissionModule } from '@/submission/submission.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AssignmnetController } from './assignment.controller'
import { Assignment } from './assignment.entity'
import { AssignmentService } from './assignment.service'

@Module({
  imports: [TypeOrmModule.forFeature([Assignment]), SubmissionModule],
  controllers: [AssignmnetController],
  providers: [AssignmentService],
})
export class AssignmentModule { }
