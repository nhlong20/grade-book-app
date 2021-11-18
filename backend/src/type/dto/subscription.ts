import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'

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

export enum InvitationType {
  TEACHER = 'teacher',
  STUDENT = 'student'
}

export class SRSendInvitation {
  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsUUID()
  classId: string

  @ApiProperty({ enum: InvitationType, enumName: "InvitationType" })
  @IsEnum(InvitationType)
  type: InvitationType
}
