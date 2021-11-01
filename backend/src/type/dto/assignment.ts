import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Max,
} from 'class-validator'

export class Create {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsDate()
  dueDate: Date

  @IsNumber()
  @IsPositive()
  maxScore: number

  @IsNumber()
  @Max(100)
  percentage: number

  @IsUUID()
  classID: string
}

export class UpdatePercentage {
  @IsNumber()
  @Max(100)
  percentage: number
}
