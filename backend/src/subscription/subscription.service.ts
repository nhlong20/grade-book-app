import { Class } from '@/class/class.entity'
import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Subscription } from './subscription.entity'
import * as moment from 'moment'
import { Cache } from 'cache-manager'
import { randomBytes } from 'crypto'
import { MailService } from '@/mail/mail.service'

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,

    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private mailService: MailService,
  ) { }

  async create(req: AuthRequest, dto: DTO.Subscription.SRCreate) {
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

  async createByCode(req: AuthRequest, dto: DTO.Subscription.SRCreateByCode) {
    const c = await this.classRepo.findOne({ inviteCode: dto.code })
    const ownerId = req.user.sub

    if (!c) throw new BadRequestException('Class do not exist')

    if (await this.checkExistence(ownerId, c.id))
      throw new BadRequestException('You have already taken part in the class')

    if (
      c.codeExpiration !== null &&
      moment(c.codeExpiration).isSameOrBefore(moment())
    ) {
      throw new BadRequestException('The code is expired')
    }

    return await this.subscriptionRepo.save({
      ownerId,
      classId: c.id,
    })
  }

  async sendInvitation(dto: DTO.Subscription.SRSendInvitation) {
    const payload = JSON.stringify(dto)
    const token = randomBytes(48).toString('base64')

    await this.cacheManager.set(token, payload, { ttl: 5 * 60 }) // 5m
    this.mailService
      .sendMail({
        to: dto.email,
        subject: 'You are invited to a class',
        html: process.env.FE_URL + '/invite?token=' + token,
      })
      .catch((e) => Logger.log(e))

    return
  }

  async createByInvitation(
    dto: DTO.Subscription.SRCreateByInvitation,
    req: AuthRequest,
  ) {
    const payload = (await this.cacheManager.get(dto.token)) as string | null

    const { classId, email } = JSON.parse(payload) as {
      email: string
      classId: string
    }

    if (!classId) throw new BadRequestException('Token does not exist')
    if (email !== req.user.email)
      throw new BadRequestException('Token is invalid')

    const c = await this.classRepo.findOne(classId)
    if (!c) throw new BadRequestException('Class does not exist')

    return this.create(req, { classId }).then((res) => {
      this.cacheManager.del(dto.token)
      return res
    })
  }

  async checkExistence(ownerId: string, classId: string) {
    const subscription = await this.subscriptionRepo.findOne({
      ownerId,
      classId,
    })
    return !!subscription
  }

  async deleteOne(id: string) {
    return await this.subscriptionRepo.delete(id)
  }
}
