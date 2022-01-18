import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'

@ApiTags('user')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) { }

  @Patch()
  @ApiOperation({ summary: 'to patch user' })
  patch(@Body() dto: DTO.User.UserPatching, @Request() req: AuthRequest) {
    return this.service.patch(req, dto)
  }

  @Get()
  @ApiOperation({ summary: 'to get classes that user is the owner or the member' })
  getUserClasses(@Request() req: AuthRequest) {
    return this.service.getUserClasses(req)
  }

  @Get("/notification")
  @ApiOperation({ summary: 'to get call notification of user' })
  getUserNotification(@Request() req: AuthRequest) {
    return this.service.getUserNotifications(req)
  }

}
