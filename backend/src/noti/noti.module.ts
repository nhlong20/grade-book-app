import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotiController } from './noti.controller'
import { Noti } from './noti.entity'
import { NotiService } from './noti.service'


@Module({
  imports: [TypeOrmModule.forFeature([Noti])],
  controllers: [NotiController],
  providers: [NotiService],
})
export class NotiModule { }
