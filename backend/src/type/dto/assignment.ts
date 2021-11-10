import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Max,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class ACreate {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsDate()
  dueDate: Date

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  maxScore: number

  @ApiProperty({
    maximum: 100
  })
  @IsNumber()
  @Max(100)
  percentage: number

  @ApiProperty()
  @IsUUID()
  classID: string
}

export class AUpdatePercentage {
  @ApiProperty({
    maximum: 100
  })
  @IsNumber()
  @Max(100)
  percentage: number
}
