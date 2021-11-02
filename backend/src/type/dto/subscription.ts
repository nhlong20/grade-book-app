import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class Create {
  @IsString()
  @IsNotEmpty()
  classId: string
}

export class CreateByCode {
  @IsString()
  @IsNotEmpty()
  code: string
}

export class CreateByInvitation {
  @IsString()
  @IsNotEmpty()
  token: string
}

export class SendInvitation {
  @IsEmail()
  email: string

  @IsUUID()
  classId: string
}
