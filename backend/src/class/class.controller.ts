import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
  sendInvitation(
    @Param('id', ParseUUIDPipe) classId: string,
    @Request() req: AuthRequest,
    @Body() dto: DTO.Class.SendInvitation,
  ) {
    return this.service.sendInvitation(classId, dto, req)
  }

  @Put(':id/join')
  @ApiOperation({ summary: 'to join class' })
  join(
    @Param('id', ParseUUIDPipe) classId: string,
    @Request() req: AuthRequest,
    @Body() dto: DTO.Class.JoinClass,
  ) {
    return this.service.join(classId, dto, req)
  }

  @Get(':id/grade-structure')
  @ApiOperation({ summary: 'to get grade structure' })
  getGradeStructure(
    @Param('id', ParseUUIDPipe) classId: string,
    @Request() req: AuthRequest,
  ) {
    return 1
  }

  @Post(':id/grade-structure')
  @ApiOperation({ summary: 'to add new grade structure' })
  creatGradeStructure(
    @Param('id', ParseUUIDPipe) classId: string,
    @Request() req: AuthRequest,
    @Body() dto: DTO.Class.CreateGradeStructure,
  ) {
    return this.service.creatGradeStructure(classId, dto, req)
  }

  @Patch(':id/grade-structure/:gsId')
  @ApiOperation({ summary: 'to add new grade structure' })
  updateGradeStructure(
    @Param('id', ParseUUIDPipe) classId: string,
    @Request() req: AuthRequest,
    @Body() dto: DTO.Class.CreateGradeStructure,
  ) {
    return 1
  }

  @Delete(':id/grade-structure/:gsId')
  @ApiOperation({ summary: 'to add new grade structure' })
  deleteGradeStructure(
    @Param('id', ParseUUIDPipe) classId: string,
    @Request() req: AuthRequest,
  ) {
    return 1
  }

}
