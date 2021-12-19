import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { Response as Res, Request as Req } from 'express'
import { memoryStorage } from 'multer'
import { StudentService } from './student.service'

@Controller('student')
@ApiTags('student')
@ApiBearerAuth('access-token')
export class StudentController {
  constructor(private service: StudentService) {}

  @Get('grade/:id')
  @ApiOperation({ summary: 'to get grade of the class' })
  getGrade(@Param('id', ParseUUIDPipe) classId: string) {
    return this.service.getGradeOfClass(classId)
  }

  @Get('csv/default')
  @ApiOperation({ summary: 'to get the csv template for creating student' })
  async getDefaultTemplate(@Response({ passthrough: true }) res: Res) {
    const csv = await this.service.sendDefaultTemplateToCreate()

    res.set('Content-Type', 'text/csv')
    res.set('Content-Disposition', 'attachment; filename="template.csv"')

    return new StreamableFile(Buffer.from(csv))
  }

  @Get('csv/scoring')
  @ApiOperation({ summary: 'to get the csv template for scoring' })
  getScoringTemplate(
    @Query('classId', ParseUUIDPipe) classId: string,
    @Response({ passthrough: true }) res: Res,
  ) {
    return this.service.sendTemplateForScoring(res, classId)
  }

  @Get('csv/scoreboard')
  @ApiOperation({ summary: 'to get the score board csv' })
  getScoreboard(
    @Response({ passthrough: true }) res: Res,
    @Query('classId', ParseUUIDPipe) classId: string,
  ) {
    return this.service.sendScoreBoard(classId, res)
  }

  @Put('expose/:id')
  @ApiOperation({ summary: 'to expose one individually grade' })
  expose(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.expose(id)
  }

  @Put('expose/batch')
  @ApiOperation({ summary: 'to expose one individually grade' })
  batchExpose(@Body() dto: DTO.Student.BatchExpose) {
    return this.service.batchExpose(dto)
  }

  @Patch('grade/:id')
  @ApiOperation({ summary: 'to update one individually grade' })
  updateGrade(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DTO.Student.UpdatePoint,
  ) {
    return this.service.updatePoint(id, dto)
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'to input list of class student via uploading' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  batchCreateStudent(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthRequest,
    @Param('id', ParseUUIDPipe) classId: string,
  ) {
    return this.service.bulkCreateStudent(file.buffer, classId, req)
  }

  @Post('grade/batch/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'to batch update grade of students via uploading' })
  batchUpdateGrade(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.bulkUpdatePoint(file.buffer, id, req)
  }
}
