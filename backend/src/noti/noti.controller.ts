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
  Req,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { NotiService } from './noti.service'

@Controller('noti')
@ApiTags('noti')
@ApiBearerAuth('access-token')
export class NotiController {
  constructor(private service: NotiService) { }

  @Get('')
  @ApiOperation({ summary: 'to get one notification' })
  getOneReview(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ) {
    return this.service.listNotifications(id, req)
  }

  
}
