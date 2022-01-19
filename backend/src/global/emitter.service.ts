import { Injectable, MessageEvent } from '@nestjs/common'
import { BehaviorSubject } from 'rxjs'
import { OpCode } from 'src/type/opcode'
import { OnEvent } from '@nestjs/event-emitter'

@Injectable()
export class EmitterService {
  public $emitter: BehaviorSubject<MessageEvent>

  constructor() {
    this.$emitter = new BehaviorSubject<MessageEvent>({
      data: { opcode: OpCode.CONNECT_SUCCESSFULLY },
    })
  }

  @OnEvent('noti.created', { async: true })
  invalidateSession() {
    this.$emitter.next({ data: { opcode: OpCode.CONNECT_SUCCESSFULLY } })
  }
}