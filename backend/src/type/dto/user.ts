
import { Role } from "@/user/user.entity";
import { IsEnum } from "class-validator";

export class UpdateRole {
  @IsEnum(Role)
  role: Role[]
}
