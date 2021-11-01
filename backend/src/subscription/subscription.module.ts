import { ClassModule } from "@/class/class.module";
import { Submission } from "@/submission/submission.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Submission]), ClassModule]
})
export class SubscriptionModule { }