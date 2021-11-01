import { IsUUID } from "class-validator";

export class Create {
  @IsUUID()
  assignmentId: string
}
