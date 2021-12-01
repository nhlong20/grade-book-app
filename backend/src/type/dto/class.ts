import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Paginate } from './util';
import { CodeType } from '@/class/class.entity';
import { Type } from 'class-transformer';

export class CCreate {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string
}

export class CGetOne {
  @ApiProperty()
  @IsUUID()
  id: string
}

export class CreateAssignment {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  point: number

  @ApiProperty()
  @IsUUID()
  gradeStructId: string
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


export class CreateGradeStructure {
  @ApiProperty()
  @IsString()
  title?: string

  @ApiProperty()
  @IsString()
  detail?: string
}