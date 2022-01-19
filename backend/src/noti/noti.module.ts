import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Noti, NotiMessage } from './noti.entity'
import { NotiService } from './noti.service'
import { NotiSubscriber } from './noti.subscriber'

@Module({
  imports: [TypeOrmModule.forFeature([Noti, NotiMessage])],
  providers: [NotiService, NotiSubscriber],
})
export class NotiModule {}
