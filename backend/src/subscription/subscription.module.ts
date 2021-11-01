import { Class } from '@/class/class.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SubscriptionController } from './subscription.controller'
import { Subscription } from './subscription.entity'
import { SubscriptionService } from './subscription.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Class]),
  ],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule { }
