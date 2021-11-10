import { DTO } from "@/type";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SubjectService } from "./subject.service";

@ApiTags('subject')
@ApiBearerAuth('access-token')
@Controller('subject')
export class SubjectController {
  constructor(
    private readonly service: SubjectService
  ) { }

  @Post()
  @ApiOperation({ summary: "to create a subject" })
  create(@Body() dto: DTO.Subject.SubjectCreate) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({ summary: "to get all subject" })
  getMany() {
    return this.service.getMany()
  }
}