import { IsNotEmpty, IsString } from "class-validator"

export class Create {
  @IsString()
  @IsNotEmpty()
  classId: string
}

export class CreateByCode {
  @IsString()
  @IsNotEmpty()
  code: string
}