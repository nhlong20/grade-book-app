import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Login {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}

export class LoginByGoogle {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  googleId: string
}

export class SignUp {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  googleId?: string
}

export class CheckUserExistence {
  @ApiProperty()
  @IsEmail()
  email: string
}