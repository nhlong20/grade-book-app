import { Subscription } from '@/subscription/subscription.entity'
import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Class } from './class.entity'
import * as nanoid from 'nanoid'
import { User } from '@/user/user.entity'

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class) private readonly classRepo: Repository<Class>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) { }

  async create(dto: DTO.Class.CCreate, req: AuthRequest) {
    const user = await this.userRepo.findOne({ where: { id: req.user.sub } })

    return this.classRepo.save({
      ...dto,
      teachers: [user]
    })
  }

  getMany(query: DTO.Class.CGetManyQuery) {
    Object.keys(query).forEach(
      (key) => query[key] === undefined && delete query[key],
    )

    return this.classRepo.find({
      where: query,
      relations: ['teachers']
    })
  }

  async getOne(dto: DTO.Class.CGetOne, req?: AuthRequest) {
    if (
      dto.id &&
      !(await this.subscriptionRepo.findOne({
        ownerId: req.user.sub,
        classId: dto.id,
      }))
    )
      throw new BadRequestException('You have not taken part in this class yet')

    const c = await this.classRepo.findOne({
      where: { id: dto.id },
      relations: ['teachers']
    })

    if (c.teachers.some(t => t.id === req?.user.sub)) {
      return c
    } else {
      throw new BadRequestException('You have not taken part in this class yet')
    }
  }

  async createCode(
    classId: string,
    dto: DTO.Class.CCreateCode,
    req: AuthRequest,
  ) {
    const c = await this.classRepo.findOne(classId)
    if (!c) throw new BadRequestException('Class does not exist')

    const code = nanoid.nanoid()

    c.inviteCode = code
    c.codeExpiration = dto.expiration || null

    return this.classRepo.save(c)
  }
}
