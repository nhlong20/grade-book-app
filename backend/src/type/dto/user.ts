
import { Role } from "@/user/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class UUpdateRole {
  @ApiProperty({ enum: Role, enumName: 'Role' })
  @IsEnum(Role)
  role: Role
}
