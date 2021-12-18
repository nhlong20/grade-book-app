import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CsvModule } from 'nest-csv-parser'
import { StudentController } from './student.controller'
import { Student } from './student.entity'
import { StudentService } from './student.service'

@Module({
  imports: [CsvModule, TypeOrmModule.forFeature([Student])],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
