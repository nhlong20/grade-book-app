import { Class, GradeStructure } from '@/class/class.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CsvModule } from 'nest-csv-parser'
import { StudentController } from './student.controller'
import { Grade, Student } from './student.entity'
import { StudentService } from './student.service'

@Module({
  imports: [
    CsvModule,
    TypeOrmModule.forFeature([Student, Class, GradeStructure, Grade]),
  ],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
