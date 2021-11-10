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
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response as ExpressResponse, Request as ExpressRequest } from 'express'
import { AuthService } from './auth.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @Public()
  @Post('login')
  @ApiOperation({ summary: "to log in" })
  logIn(
    @Body() body: DTO.Auth.Login,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    return this.service.login(body, res)
  }

  @Public()
  @ApiOperation({ summary: "to sign up" })
  @Post('signup')
  signUp(@Body() body: DTO.Auth.SignUp) {
    return this.service.signup(body)
  }

  @Public()
  @ApiOperation({ summary: "to refresh access token" })
  @Post('refresh')
  refresh(
    @Request() req: ExpressRequest,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    return this.service.refresh(req, res)
  }

  @Delete()
  @ApiOperation({ summary: "to log out" })
  logOut(@Response({ passthrough: true }) res: ExpressResponse) {
    return this.service.logout(res)
  }
}
