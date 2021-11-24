import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate } from 'nestjs-typeorm-paginate'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) { }

  async patch(req: AuthRequest, dto: DTO.User.UserPatching) {
    const user = await this.userRepo.findOne({
      where: { email: req.user.email },
    })
    if (!user) throw new BadRequestException('User does not exist')

    return this.userRepo.save({
      ...user,
      ...dto,
    })
  }

  getUserClasses() {
    const qb = this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.classes', 'class')
      .select('u.classes')

    return paginate(qb, {
      limit: 10,
      page: 1,
    })
  }
}
