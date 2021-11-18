import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Class } from './class.entity'
import { User } from '@/user/user.entity'
import { paginate } from 'nestjs-typeorm-paginate'

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class) private readonly classRepo: Repository<Class>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }

  async create(dto: DTO.Class.CCreate, req: AuthRequest) {
    const user = await this.userRepo.findOne({ where: { id: req.user.id } })

    return this.classRepo.save({
      ...dto,
      teachers: [user],
    })
  }

  getMany(query: DTO.Class.CGetManyQuery) {
    let qb = this.classRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.teachers', 'user')
      .leftJoinAndSelect('c.students', 'user')

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

    return paginate(qb, { limit: query.limit, page: query.page })
  }

  async getOne(dto: DTO.Class.CGetOne, req?: AuthRequest) {
    const [c, user] = await Promise.all([
      this.classRepo.findOne({
        where: { id: dto.id },
        relations: ['teachers'],
      }),
      this.userRepo.findOne({ where: { email: req.user.email } })
    ])

    if (!user) throw new BadRequestException('User does not exist')
    if (c.teachers.some((t) => t.id === user.id)) {
      return c
    } else {
      throw new BadRequestException('User has not taken part in this class yet')
    }
  }
}
