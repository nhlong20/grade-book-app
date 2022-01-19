import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  EventSubscriber,
  EntitySubscriberInterface,
  Connection,
  InsertEvent,
} from 'typeorm'
import { Noti } from './noti.entity'

@EventSubscriber()
export class NotiSubscriber implements EntitySubscriberInterface<Noti> {
  constructor(connection: Connection, private eventEmitter: EventEmitter2) {
    connection.subscribers.push(this)
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  listenTo(): string | Function {
    return Noti
  }

  afterInsert(event: InsertEvent<Noti>): void | Promise<any> {
    this.eventEmitter.emit('noti.created')
  }
}
