import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'

export class CreateComment {
  @ApiProperty()
  @IsUUID()
  reviewId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  content: string
}
