import { Class } from '@/class/class.entity'
import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Subscription } from './subscription.entity'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,

    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) { }

  async create(req: AuthRequest, dto: DTO.Subscription.Create) {
    const ownerId = req.user.sub

    if (await this.checkExistence(ownerId, dto.classId))
      throw new BadRequestException('You have already taken part in the class')

    return await this.subscriptionRepo.save({
      ...dto,
      ownerId,
    })
  }

  async getSubscriptedClasses(req: AuthRequest) {
    const id = req.user.sub

    const subscriptions: Subscription[] = await this.subscriptionRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.class', 'class')
      .where('s.owner_id=:id', { id })
      .execute()

    return subscriptions.map((s) => s.class)
  }

  async getSubscriptedStudents(classId: string) {
    const subscriptions: Subscription[] = await this.subscriptionRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.owner', 'owner')
      .where('s.class_id=:id', { id: classId })
      .execute()

    return subscriptions.map((s) => s.owner)
  }

  async createByCode(req: AuthRequest, dto: DTO.Subscription.CreateByCode) {
    const c = await this.classRepo.findOne({ inviteCode: dto.code })
    const ownerId = req.user.sub

    if (!c) throw new BadRequestException('Class do not exist')

    if (await this.checkExistence(ownerId, c.id))
      throw new BadRequestException('You have already taken part in the class')

    return await this.subscriptionRepo.save({
      ownerId,
      classId: c.id
    })
  }

  async checkExistence(ownerId: string, classId: string) {
    const subscription = await this.subscriptionRepo.findOne({ ownerId, classId })
    return !!subscription
  }

  async deleteOne(id: string) {
    return await this.subscriptionRepo.delete(id)
  }
}
