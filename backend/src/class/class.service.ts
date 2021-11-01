import { Subscription } from '@/subscription/subscription.entity'
import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Class } from './class.entity'

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class) private readonly classRepo: Repository<Class>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) { }

  create(dto: DTO.Class.Create) {
    return this.classRepo.save(dto)
  }

  getMany() {
    return this.classRepo.find()
  }

  async getOne(dto: DTO.Class.GetOne, req?: AuthRequest) {
    if (
      dto.id &&
      !(await this.subscriptionRepo.findOne({
        ownerId: req.user.sub,
        classId: dto.id,
      }))
    )
      throw new BadRequestException('You have not taken part in this class yet')

    let qb = this.classRepo.createQueryBuilder('c')

    if (dto.code) {
      qb = qb.where('u.code=:code', { code: dto.code })
    }

    if (dto.id) {
      qb = qb.andWhere('u.id=:id', { id: dto.id })
    }

    return qb.execute()
  }
}
