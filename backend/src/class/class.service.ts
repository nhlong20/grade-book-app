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
  ) { }

  async create(dto: DTO.Class.CCreate, req: AuthRequest) {
    const user = await this.userRepo.findOne({ where: { id: req.user.sub } })

    return this.classRepo.save({
      ...dto,
      teachers: [user],
    })
  }

  getMany(query: DTO.Class.CGetManyQuery) {
    let qb = this.classRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.teachers', 'user')

    if (query.classId) {
      return qb.where('c.id=:classId', { classId: query.classId }).getOne()
    }

    if (query.credit) {
      qb = qb.andWhere('c.credit=:cr', { cr: query.credit })
    }

    if (query.semester) {
      qb = qb.andWhere('c.semester=:sem', { sem: query.semester })
    }

    if (query.query) {
      qb = qb.andWhere(
        "to_tsvector(c.name) @@ plainto_tsquery(:query)",
        { query: query.query },
      )
    }

    return qb.getMany()
  }

  async getOne(dto: DTO.Class.CGetOne, req?: AuthRequest) {
    const c = await this.classRepo.findOne({
      where: { id: dto.id },
      relations: ['teachers'],
    })

    if (c.teachers.some((t) => t.id === req?.user.sub)) {
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
