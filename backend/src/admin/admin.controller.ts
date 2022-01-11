import { DTO } from '@/type'
import { User } from '@/user/user.entity'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { Pagination } from 'nestjs-typeorm-paginate'
import { AdminService } from './admin.service'

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth('access-token')
export class AdminController {
  constructor(private service: AdminService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  @ApiOperation({ summary: 'to create admin account' })
  createAdmin(@Body() dto: DTO.Admin.CreateAdmin) {}

  @Get()
  @ApiCreatedResponse({ type: Pagination })
  @ApiOperation({ summary: 'to get many admin account' })
  getAdmins(@Query() query: DTO.Admin.GetAdminsQuery) {}

  @Get(':id')
  @ApiCreatedResponse({ type: User })
  @ApiOperation({ summary: 'to get detailed admin account' })
  getDetailedAdmin(@Param('id', ParseUUIDPipe) id: string) {}

  @Get('/users')
  @ApiCreatedResponse({ type: Pagination })
  @ApiOperation({ summary: 'to get many users account' })
  getUser(@Query() query: DTO.Admin.GetAdminsQuery) {}

  @Get('/users/:id')
  @ApiCreatedResponse({ type: User })
  @ApiOperation({ summary: 'to get detailed user account' })
  getDetailedUser(@Param('id', ParseUUIDPipe) id: string) {}

  @Get('/users/:id/studen-id')
  @ApiCreatedResponse({ type: User })
  @ApiOperation({ summary: 'to update student id of a student, null to unmap' })
  updateStudentId(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DTO.Admin.UpdateStudentId,
  ) {}

  @Put('/users/:id/ban')
  @ApiCreatedResponse({ type: User })
  @ApiOperation({ summary: 'to ban student' })
  ban(@Param('id', ParseUUIDPipe) id: string) {}

  @Put('/users/:id/unban')
  @ApiCreatedResponse({ type: User })
  @ApiOperation({ summary: 'to unban student' })
  unban(@Param('id', ParseUUIDPipe) id: string) {}

  @Get('class')
  @ApiCreatedResponse({ type: Pagination })
  @ApiOperation({ summary: 'to get many classes account' })
  getClasses(@Query() query: DTO.Admin.GetAdminsQuery) {}

  @Get('class/:id')
  @ApiCreatedResponse({ type: Pagination })
  @ApiOperation({ summary: 'to get detailed class account' })
  getDetailedClass(@Param('id', ParseUUIDPipe) id: string) {}
}
