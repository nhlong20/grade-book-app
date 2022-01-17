import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotiController } from './noti.controller'
import { Noti, NotiMessage } from './noti.entity'
import { NotiService } from './noti.service'


@Module({
  imports: [TypeOrmModule.forFeature([Noti, NotiMessage])],
  controllers: [NotiController],
  providers: [NotiService],
})
export class NotiModule { }
