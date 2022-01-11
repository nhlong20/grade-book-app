import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
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
  @MinLength(0)
  expectedGrade: number
}
