import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Noti, NotiMessage } from './noti.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class NotiService {
  constructor(
    @InjectRepository(Noti) private notiRepo: Repository<Noti>,
    @InjectRepository(NotiMessage)
    private notiMessageRepo: Repository<NotiMessage>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createNotiMessage(dto: DTO.NotiMessage.CreateNotiMessage) {
    return this.notiMessageRepo.save({
      ...dto,
    })
  }

  async createNoti(dto: DTO.Noti.CreateNotification, req: AuthRequest) {
    console.log(dto.receivers)
    const noti = await this.notiRepo.save({
      actorId: req.user.id,
      receivers: dto.receivers,
      ...dto,
    })
    this.eventEmitter.emit('noti', noti)
    return noti
  }
}
