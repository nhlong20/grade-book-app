import { User } from '@/user/user.entity'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsUUID,
} from 'class-validator'

export class CreateNotification {
  @ApiProperty()
  @IsUUID()
  messageId: string
  
  @ApiProperty()
  receivers: User[]
}
