import { SubmissionService } from '@/submission/submission.service'
import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
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

  @Put(':classId/code')
  createCode(
    dto: DTO.Class.CreateCode,
    @Param('classId', ParseUUIDPipe) classId: string,
    @Request() req: AuthRequest,
  ) {
    return this.service.createCode(classId, dto, req)
  }

  @Get()
  getClasses(
    @Request() req: AuthRequest,
    @Query('classId', ParseUUIDPipe) classId?: string,
  ) {
    if (classId) {
      return this.service.getOne({ id: classId }, req)
    }
    return this.service.getMany()
  }

  @Get('grade')
  getClassesGrade(@Query('classId', ParseUUIDPipe) classId: string) {
    return this.submissionService.getManyByClassId(classId)
  }
}
