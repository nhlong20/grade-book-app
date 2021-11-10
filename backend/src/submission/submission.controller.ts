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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SubmissionService } from './submission.service'

@ApiTags('submission')
@ApiBearerAuth('access-token')
@Controller('submission')
export class SubmissionController {
  constructor(
    private readonly service: SubmissionService,
  ) { }

  @Post()
  @ApiOperation({ summary: "create submission" })
  create(@Body() dto: DTO.Submission.SCreate, @Request() req: AuthRequest) {
    return this.service.create(req, dto)
  }

  @Get()
  @ApiOperation({ summary: "get one submission" })
  getOne(@Query('id', ParseUUIDPipe) id: string, @Request() req: AuthRequest) {
    return this.service.getOne(req, id)
  }

  @Post('score/bulk')
  @ApiOperation({ summary: "bulk update score by uploading csv" })
  @UseInterceptors(FileInterceptor('file'))
  bulkUpdateScore(@UploadedFile() file: Express.Multer.File) {
    return this.service.bulkUpdateScore(file.buffer)
  }
}
