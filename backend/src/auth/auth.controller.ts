import { DTO } from '@/type'
import { Public } from '@/utils/decorators/public.decorator'
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
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
  @ApiOperation({ summary: "to login with google" })
  @Post('login-with-google')
  logInWithGoogle(@Body() dto: DTO.Auth.LoginByGoogle) {
    return this.service.loginByGoggle(dto)
  }

  @Public()
  @ApiOperation({ summary: "to check if account exists" })
  @Get()
  check(@Query() dto: DTO.Auth.CheckUserExistence) {
    return this.service.checkExistence(dto.email)
  }
}
