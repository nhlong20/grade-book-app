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
import { SubscriptionService } from './subscription.service'

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) { }

  @Post()
  create(@Body() dto: DTO.Subscription.Create, @Request() req: AuthRequest) {
    return this.service.create(req, dto)
  }

  @Post('by-code')
  createByCode(
    @Body() dto: DTO.Subscription.CreateByCode,
    @Request() req: AuthRequest,
  ) {
    return this.service.createByCode(req, dto)
  }

  @Get()
  getSubscriptedStudent(@Query('classId', ParseUUIDPipe) classId: string) {
    return this.service.getSubscriptedStudents(classId)
  }

  @Get('self')
  getSubscriptedClasses(@Request() req: AuthRequest) {
    return this.service.getSubscriptedClasses(req)
  }
}
