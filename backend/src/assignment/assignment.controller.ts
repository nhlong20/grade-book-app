import { SubmissionService } from '@/submission/submission.service'
import { DTO } from '@/type'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { AssignmentService } from './assignment.service'

@Controller('assignment')
export class AssignmnetController {
  constructor(
    private readonly service: AssignmentService,
    private readonly submissionService: SubmissionService,
  ) { }

  @Post()
  create(@Body() dto: DTO.Assignment.Create) {
    return this.service.create(dto)
  }

  @Put(':id')
  updatePercentage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DTO.Assignment.UpdatePercentage,
  ) {
    return this.service.updateAssignmentPercentage(id, dto)
  }

  @Get('grade')
  getAssignmentGrade(
    @Query('assignmentId', ParseUUIDPipe) assignmentId: string,
  ) {
    return this.submissionService.getManyByAssignmentId(assignmentId)
  }
}
