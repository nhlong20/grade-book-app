import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'

export class CreateNotiMessage {
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
  @IsOptional()
  sourceId: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  sourceType: string
}
