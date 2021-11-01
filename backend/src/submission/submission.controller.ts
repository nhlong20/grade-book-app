import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common'
import { SubmissionService } from './submission.service'

@Controller('submission')
export class SubmissionController {
  constructor(private readonly service: SubmissionService) { }

  @Post()
  create(@Body() dto: DTO.Submission.Create, @Request() req: AuthRequest) {
    return this.service.create(req, dto)
  }

  @Get()
  getOne(@Query('id', ParseUUIDPipe) id: string, @Request() req: AuthRequest) {
    return this.service.getOne(req, id)
  }
}
