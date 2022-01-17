import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Noti, NotiMessage } from './noti.entity'

@Injectable()
export class NotiService {
  constructor(
    @InjectRepository(Noti) private notiRepo: Repository<Noti>,
    @InjectRepository(NotiMessage) private notiMessageRepo: Repository<NotiMessage>
  ) { }

  async createNoti(dto: DTO.Noti.CreateNotification, req: AuthRequest) {
    return this.notiRepo.save({
      actorId: req.user.id,
      ...dto,
    })
  }

  async createNotiMessage(dto: DTO.NotiMessage.CreateNotiMessage) {
    return this.notiMessageRepo.save({
      ...dto,
    })
  }
}
