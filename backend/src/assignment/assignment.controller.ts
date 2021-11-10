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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AssignmentService } from './assignment.service'

@ApiTags('assignment')
@ApiBearerAuth('access-token')
@Controller('assignment')
export class AssignmnetController {
  constructor(
    private readonly service: AssignmentService,
    private readonly submissionService: SubmissionService,
  ) { }

  @Post()
  @ApiOperation({ summary: "create assignment" })
  create(@Body() dto: DTO.Assignment.ACreate) {
    return this.service.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: "update assignment's percentage" })
  updatePercentage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DTO.Assignment.AUpdatePercentage,
  ) {
    return this.service.updateAssignmentPercentage(id, dto)
  }

  @Get('grade')
  @ApiOperation({ summary: "get all submissions of a assignmnet" })
  getAssignmentGrade(
    @Query('assignmentId', ParseUUIDPipe) assignmentId: string,
  ) {
    return this.submissionService.getManyByAssignmentId(assignmentId)
  }
}
