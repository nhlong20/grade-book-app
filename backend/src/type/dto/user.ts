
import { Role } from "@/user/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class UpdateRole {
  @ApiProperty({ enum: Role, enumName: 'Role' })
  @IsEnum(Role)
  role: Role
}
