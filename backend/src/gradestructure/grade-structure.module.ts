import { Class } from '@/class/class.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GradeStructure } from './grade-structure.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Class, GradeStructure])],
})
export class GradeStructureModule { }
