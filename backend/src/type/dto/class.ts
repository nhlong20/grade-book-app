import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export class Create {
  @IsString()
  @IsNotEmpty()
  name: string
}

export class GetOne {
  @IsUUID()
  id: string
}

export class CreateCode {
  @IsDate()
  @IsOptional()
  expiration?: Date
}
