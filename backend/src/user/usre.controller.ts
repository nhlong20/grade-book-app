import { DTO } from '@/type'
import { Body, Controller, Param, ParseUUIDPipe, Put } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) { }

  @Put(':id/role')
  updateRole(
    @Body() dto: DTO.User.UpdateRole,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.updateRole(id, dto)
  }
}
