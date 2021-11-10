import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CsvModule } from 'nest-csv-parser'
import { SubmissionController } from './submission.controller'
import { Submission } from './submission.entity'
import { SubmissionService } from './submission.service'

@Module({
  imports: [TypeOrmModule.forFeature([Submission]), CsvModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule { }
