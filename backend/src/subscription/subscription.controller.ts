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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SubscriptionService } from './subscription.service'

@ApiTags('subscription')
@ApiBearerAuth('access-token')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) { }

  @Post()
  @ApiOperation({ summary: "create subscription/join class" })
  create(@Body() dto: DTO.Subscription.SRCreate, @Request() req: AuthRequest) {
    return this.service.create(req, dto)
  }

  @Post('by-code')
  @ApiOperation({ summary: "join class by code" })
  createByCode(
    @Body() dto: DTO.Subscription.SRCreateByCode,
    @Request() req: AuthRequest,
  ) {
    return this.service.createByCode(req, dto)
  }

  @Get()
  @ApiOperation({ summary: "get students of a class" })
  getSubscriptedStudent(@Query('classId', ParseUUIDPipe) classId: string) {
    return this.service.getSubscriptedStudents(classId)
  }

  @Get('self')
  @ApiOperation({ summary: "get user's class" })
  getSubscriptedClasses(@Request() req: AuthRequest) {
    return this.service.getSubscriptedClasses(req)
  }
}
