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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ClassService } from './class.service'

@ApiTags('class')
@ApiBearerAuth('access-token')
@Controller('class')
export class ClassController {
  constructor(private readonly service: ClassService) { }

  @Post()
  @ApiOperation({ summary: 'create class' })
  create(@Body() dto: DTO.Class.CCreate, @Request() req: AuthRequest) {
    return this.service.create(dto, req)
  }

  @Get(':id')
  @ApiOperation({ summary: 'to get one class' })
  getClass(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: AuthRequest,
  ) {
    return this.service.getOne({ id }, req)
  }

  @Get()
  @ApiOperation({ summary: 'get many classes' })
  getClasses(@Query() query: DTO.Class.CGetManyQuery) {
    return this.service.getMany(query)
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'to send invitation' })
  sendInvitation() {

  }

  @Put(':id/student/join')
  @ApiOperation({ summary: 'to join class as student' })
  joinClassAsStudent() { }

  @Put(':id/teacher/join')
  @ApiOperation({ summary: 'to join class as teacher' })
  joinClassAsTeacher() { }
}
