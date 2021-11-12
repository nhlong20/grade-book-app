import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  Body,
  Controller,
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

}
