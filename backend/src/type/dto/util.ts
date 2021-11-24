import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsPositive } from "class-validator"

export class Paginate {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  page = 1

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  limit = 10
}