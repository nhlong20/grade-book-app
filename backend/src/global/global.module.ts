import { Global, Module } from '@nestjs/common'
import { UserModule } from 'src/user/user.module'
import { EmitterService } from './emitter.service'
import { SubscribeController } from './subscribe.controller'

@Global()
@Module({
  imports: [UserModule],
  controllers: [SubscribeController],
  providers: [EmitterService],
})
export class GlobalModule { }