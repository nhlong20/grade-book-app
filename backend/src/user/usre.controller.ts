import { DTO } from '@/type'
import { Body, Controller, Param, ParseUUIDPipe, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) { }

  @Put(':id/role')
  @ApiOperation({ summary: "update role of user" })
  updateRole(
    @Body() dto: DTO.User.UpdateRole,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.updateRole(id, dto)
  }
}
