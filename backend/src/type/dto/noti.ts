import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateNotification {
  @ApiProperty()
  @IsArray()
  receiverIds: string[]

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @MinLength(0)
  body: string
}
