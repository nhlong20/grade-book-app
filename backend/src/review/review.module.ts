import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReviewController } from './review.controller'
import { Review, Comment } from './review.entity'
import { Class } from '../class/class.entity'
import { ReviewService } from './review.service'
import { NotiService } from '@/noti/noti.service'
import { NotiModule } from '@/noti/noti.module'
import { Noti, NotiMessage } from '@/noti/noti.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Comment, Class, Noti, NotiMessage])
  ],
  controllers: [ReviewController],
  providers: [ReviewService, NotiService],
})
export class ReviewModule {}
