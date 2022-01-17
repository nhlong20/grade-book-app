import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'

export class CreateNotiMessage {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  content: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  body: string

  @ApiProperty()
  @IsUUID()
  sourceId: string

  @ApiProperty()
  @IsString()
  sourceType: string
}
