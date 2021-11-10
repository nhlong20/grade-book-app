import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class Create {
  @ApiProperty()
  @IsUUID()
  assignmentId: string
}
