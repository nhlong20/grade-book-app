import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsUUID, Max, Min } from "class-validator";

export class UpdatePoint {
  @ApiProperty()
  @IsNumber()
  @Max(100)
  @Min(0)
  @Type(() => Number)
  point: number
}


export class BatchExpose {
  @ApiProperty()
  @IsUUID(undefined, { each: true })
  ids: string[]
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
  @Max(100)
  @Min(0)
  @Type(() => Number)
  point: number
}