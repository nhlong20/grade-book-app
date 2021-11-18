import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsPositive } from "class-validator"

export class Paginate {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  page: number

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  limit: number
}