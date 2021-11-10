import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class SCreate {
  @ApiProperty()
  @IsUUID()
  assignmentId: string
}
