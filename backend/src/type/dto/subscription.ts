import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class SRCreate {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  classId: string
}

export class SRCreateByCode {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string
}

export class SRCreateByInvitation {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string
}

export class SRSendInvitation {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsUUID()
  classId: string
}
