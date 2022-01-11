import { Controller } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@Controller('review')
@ApiTags('review')
@ApiBearerAuth('access-token')
export class ReviewController {
  constructor() {}
}
