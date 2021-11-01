import { DTO } from '@/type'
import { Public } from '@/utils/decorators/public.decorator'
import {
  Body,
  Controller,
  Delete,
  Post,
  Request,
  Response,
} from '@nestjs/common'
import { Response as ExpressResponse, Request as ExpressRequest } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Public()
  @Post('login')
  logIn(
    @Body() body: DTO.Auth.LoginDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    return this.service.login(body, res)
  }

  @Public()
  @Post('signup')
  signUp(@Body() body: DTO.Auth.SignUpDto) {
    return this.service.signup(body)
  }

  @Public()
  @Post('refresh')
  refresh(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    return this.service.refresh(req, res)
  }

  @Delete()
  logOut(@Response({ passthrough: true }) res: ExpressResponse) {
    return this.service.logout(res)
  }
}
