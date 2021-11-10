import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class Create {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  classId: string
}

export class CreateByCode {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string
}

export class CreateByInvitation {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string
}

export class SendInvitation {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsUUID()
  classId: string
}
