import { ApiOperation, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator'

export class CreateAdmin {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}

export class GetAdminsQuery {
  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @Type(() => Number)
  page = 1

  @ApiPropertyOptional({ default: 10 })
  @IsNumber()
  @Type(() => Number)
  limit = 10

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string
}

export class UpdateStudentId {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, v) => v !== null)
  studentId: string
}
