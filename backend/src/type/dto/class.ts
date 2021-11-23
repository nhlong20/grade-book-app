import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Paginate } from './util';
import { CodeType } from '@/class/class.entity';

export class CCreate {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  academicYear?: string

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  credit: number

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identityCode: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  semester: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  department: string
}

export class CGetOne {
  @ApiProperty()
  @IsUUID()
  id: string
}

export class CCreateCode {
  @ApiProperty()
  @IsDate()
  @IsOptional()
  expiration?: Date
}


export class CGetManyQuery extends Paginate {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  query?: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  credit?: number


  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  semester?: string
}

export class SendInvitation {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  emails: string[]

  @ApiProperty({ enum: CodeType, enumName: 'CodeType' })
  @IsEnum(CodeType)
  type: CodeType

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  expire?: Date
}

export class JoinClass {
  @ApiProperty()
  @IsUUID()
  token: string
}