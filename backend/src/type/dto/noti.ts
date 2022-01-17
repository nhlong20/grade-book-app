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
import { NotiMessage } from '.'

export class CreateNotification {
  @ApiProperty()
  @IsUUID()
  messageId: string
}
