import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator'

export class CreateReview {
  @ApiProperty()
  @IsUUID()
  gradeId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  explanation: string

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  expectedGrade: number
}
