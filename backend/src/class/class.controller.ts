import { SubmissionService } from '@/submission/submission.service'
import { DTO } from '@/type'
import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common'
import { ClassService } from './class.service'

@Controller('class')
export class ClassController {
  constructor(
    private readonly service: ClassService,
    private readonly submissionService: SubmissionService,
  ) { }

  @Post()
  create(@Body() dto: DTO.Class.Create) {
    return this.service.create(dto)
  }

  @Get()
  getClasses() {
    return this.service.getMany()
  }

  @Get('grade')
  getClassesGrade(@Query('classId', ParseUUIDPipe) classId: string) {
    return this.submissionService.getManyByClassId(classId)
  }
}
