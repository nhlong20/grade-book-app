import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class Create {
  @IsString()
  @IsNotEmpty()
  name: string
}

export class GetOne {
  @IsUUID()
  @IsOptional()
  id?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code?: string
}