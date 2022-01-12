import { Class } from '@/class/class.entity'
import { MailService } from '@/mail/mail.service'
import { DTO } from '@/type'
import { User } from '@/user/user.entity'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { hash } from 'bcrypt'
import { randomBytes } from 'crypto'
import moment from 'moment'
import { paginate } from 'nestjs-typeorm-paginate'
import { Repository } from 'typeorm'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Class) private classRepo: Repository<Class>,
    private mailService: MailService,
  ) {}

  async createAdmin(dto: DTO.Admin.CreateAdmin) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } })
    if (user) throw new BadRequestException('User existed')

    const token = randomBytes(48).toString('base64url')
    await this.mailService.sendActivationEmail(dto.email, token)

    return this.userRepo.save({
      isAdmin: true,
      ...dto,
      password: await hash(dto.password, 10),
      activateToken: token,
      activateTokenExpiration: moment().add(5, 'hour').toDate(),
    })
  }

  async getMany(
    { limit, page, search }: DTO.Admin.GetAdminsQuery,
    admin?: boolean,
  ) {
    let qb = this.userRepo.createQueryBuilder('u').orderBy('u.createdAt', 'ASC')

    if (admin) {
      qb = qb.where('u.isAdmin=:admin', { admin })
    }

    if (search) {
      qb = qb.andWhere(
        "to_tsvector(concat_ws(' ', name, email)) @@ plainto_tsquery(:search)",
        { search },
      )
    }

    return paginate(qb, { page, limit })
  }

  async getManyClasses({ limit, page, search }: DTO.Admin.GetAdminsQuery) {
    let qb = this.classRepo
      .createQueryBuilder('u')
      .orderBy('u.createdAt', 'ASC')

    if (search) {
      qb = qb.andWhere('to_tsvector(name) @@ plainto_tsquery(:search)', {
        search,
      })
    }

    return paginate(qb, { page, limit })
  }

  async getOneClass(id: string) {
    const clas = await this.classRepo.findOne({ where: { id } })
    if (!clas) throw new BadRequestException('Clas not found')

    return clas
  }

  async getOne(id: string, admin: boolean) {
    const user = await this.userRepo.findOne({ where: { id, isAdmin: admin } })
    if (!user) throw new BadRequestException('user does not exist')

    return user
  }
}
