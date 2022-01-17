import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Noti } from './noti.entity'

@Injectable()
export class NotiService {
  constructor(
    @InjectRepository(Noti) private reviewRepo: Repository<Noti>
  ) { }

  async listNotifications(id: string, req: AuthRequest) {
    
    return null
  }

  async createNotification(dto: DTO.Review.CreateReview, req: AuthRequest) {
    // const review = await this.reviewRepo.findOne({
    //   where: { gradeId: dto.gradeId, ownerId: req.user.id },
    // })

    // if (review) throw new BadRequestException('Review existed')

    // return this.reviewRepo.save({
    //   ownerId: req.user.id,
    //   ...dto,
    // })
  }
}
