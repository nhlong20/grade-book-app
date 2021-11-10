import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class Create {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string
}

export class GetOne {
  @ApiProperty()
  @IsUUID()
  id: string
}

export class CreateCode {
  @ApiProperty()
  @IsDate()
  @IsOptional()
  expiration?: Date
}
