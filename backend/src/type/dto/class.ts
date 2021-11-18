import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

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
  @IsUUID()
  subjectId: string
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


export class CGetManyQuery {
  @IsNumber()
  @IsPositive()
  page = 1

  @IsNumber()
  @IsPositive()
  limit = 10

  @IsString()
  @IsOptional()
  query?: string

  @IsNumber()
  @IsPositive()
  @IsOptional()
  credit?: number


  @IsString()
  @IsOptional()
  semester?: string
}