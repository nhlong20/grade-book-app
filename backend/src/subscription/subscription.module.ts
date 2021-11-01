import { ClassModule } from '@/class/class.module'
import { Submission } from '@/submission/submission.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SubscriptionController } from './subscription.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Submission]), ClassModule],
  providers: [SubscriptionModule],
  controllers: [SubscriptionController],
})
export class SubscriptionModule { }
