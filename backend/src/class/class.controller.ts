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
  constructor(
    private readonly service: ClassService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'create class' })
  create(@Body() dto: DTO.Class.CCreate, @Request() req: AuthRequest) {
    return this.service.create(dto, req)
  }

  @Put(':classId/code')
  @ApiOperation({ summary: 'create code for a class' })
  createCode(
    @Body() dto: DTO.Class.CCreateCode,
    @Param('classId', ParseUUIDPipe) classId: string,
    @Request() req: AuthRequest,
  ) {
    return this.service.createCode(classId, dto, req)
  }

  @Get()
  @ApiOperation({ summary: 'get one or many class' })
  getClasses(
    @Request() req: AuthRequest,
    @Query() query: DTO.Class.CGetManyQuery,
  ) {
    if (query.classId) {
      return this.service.getOne({ id: query.classId }, req)
    }

    return this.service.getMany(query)
  }


}
