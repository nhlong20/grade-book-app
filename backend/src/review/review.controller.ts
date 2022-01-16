import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { ReviewService } from './review.service'

@Controller('review')
@ApiTags('review')
@ApiBearerAuth('access-token')
export class ReviewController {
  constructor(private service: ReviewService) {}

  @Get(':id')
  @ApiOperation({ summary: 'to get one review' })
  getOneReview(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthRequest,
  ) {
    return this.service.getOneReview(id, req)
  }

  @Post()
  @ApiOperation({ summary: 'to create review' })
  create(@Body() dto: DTO.Review.CreateReview, @Req() req: AuthRequest) {
    return this.service.createReview(dto, req)
  }

  @Put(':id/resolve')
  @ApiOperation({ summary: 'to create review' })
  resolve(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthRequest) {
    return this.service.resolveReview(id, req)
  }

  @Post('comment')
  @ApiOperation({ summary: 'to create comment' })
  createComment(
    @Body() dto: DTO.Comment.CreateComment,
    @Req() req: AuthRequest,
  ) {
    return this.service.createComment(dto, req)
  }
}
