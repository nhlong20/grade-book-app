import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReviewController } from './review.controller'
import { Review, Comment } from './review.entity'
import { Class } from '../class/class.entity'
import { ReviewService } from './review.service'

@Module({
  imports: [TypeOrmModule.forFeature([Review, Comment, Class])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
