import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsUUID, Max, Min, MinLength } from 'class-validator'

export class UpdatePoint {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  point: number
}

export class BatchExpose {
  @ApiProperty()
  @IsArray()
  ids: string[]

  @ApiProperty()
  @IsUUID(undefined, { each: true })
  studentIds: string[]

  @ApiProperty()
  @IsUUID()
  structId: string
}

export class Expose {
  @ApiProperty()
  @IsUUID()
  studentId: string

  @ApiProperty()
  @IsUUID()
  structId: string
}

export class CreatePoint {
  @ApiProperty()
  @IsUUID()
  studentId: string

  @ApiProperty()
  @IsUUID()
  structId: string

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  point: number
}
