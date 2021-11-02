import { Subscription } from '@/subscription/subscription.entity'
import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Class } from './class.entity'
import * as nanoid from 'nanoid'

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

    return this.classRepo.findOne(dto.id)
  }

  async createCode(classId: string, dto: DTO.Class.CreateCode, req: AuthRequest) {
    const c = await this.classRepo.findOne(classId)
    if (!c) throw new BadRequestException('Class does not exist')

    const code = nanoid.nanoid()

    c.inviteCode = code
    c.codeExpiration = dto.expiration || null

    return this.classRepo.save(c)
  }
}
