import { ApiProperty } from '@nestjs/swagger'
import {
  IsUUID,
} from 'class-validator'
import { NotiMessage } from '.'

export class CreateNotification {
  @ApiProperty()
  @IsUUID()
  messageId: string
}
