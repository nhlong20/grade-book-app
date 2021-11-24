import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Class, Code, CodeType } from './class.entity'
import { User } from '@/user/user.entity'
import { paginate } from 'nestjs-typeorm-paginate'
import { MailService } from '@/mail/mail.service'
import moment from 'moment'

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class) private readonly classRepo: Repository<Class>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Code) private readonly codeRepo: Repository<Code>,
    private readonly mailService: MailService,
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
      qb = qb.andWhere('to_tsvector(c.name) @@ plainto_tsquery(:query)', {
        query: query.query,
      })
    }

    return paginate(qb, { limit: query.limit, page: query.page })
  }

  async getOne(dto: DTO.Class.CGetOne, req?: AuthRequest) {
    const [c, user] = await Promise.all([
      this.classRepo.findOne({
        where: { id: dto.id },
        relations: ['teachers', 'students'],
      }),
      this.userRepo.findOne({ where: { email: req.user.email } }),
    ])

    if (!user) throw new BadRequestException('User does not exist')
    if (
      c.teachers.some((t) => t.id === user.id) ||
      c.students.some((s) => s.id === user.id)
    ) {
      return c
    }

    throw new BadRequestException('User has not taken part in this class yet')
  }

  async sendInvitation(
    classId: string,
    dto: DTO.Class.SendInvitation,
    req: AuthRequest,
  ) {
    const [c, user] = await Promise.all([
      this.classRepo.findOne({
        where: { id: classId },
        relations: ['teachers', 'students'],
      }),
      this.userRepo.findOne({ where: { email: req.user.email } }),
    ])

    const isTeacher = c.teachers.some(({ id }) => id === user.id)
    const isStudents = c.students.some(({ id }) => id === user.id)

    if (dto.type === CodeType.Teacher && !isTeacher) {
      throw new BadRequestException('User is not allowed to invite a teacher')
    }

    if (!isTeacher && !isStudents) {
      throw new BadRequestException('User has not taken part in this class yet')
    }

    const code = await this.codeRepo.save(dto)
    await Promise.allSettled(
      dto.emails.map((email) =>
        this.mailService
          .sendMail({
            to: email,
            subject: 'You are invited to a class at GradeBook',
            html: process.env.FE_URL + '/invite?token=' + code.id,
          })
          .catch((e) => {
            Logger.log('Send email failed to ' + email)
            return e
          }),
      ),
    )

    return true
  }

  async join(classId: string, dto: DTO.Class.JoinClass, req: AuthRequest) {
    const [c, user] = await Promise.all([
      this.classRepo.findOne({
        where: { id: classId },
        relations: ['teachers', 'students'],
      }),
      this.userRepo.findOne({ where: { email: req.user.email } }),
    ])

    const isTeacher = c.teachers.some(({ id }) => id === user.id)
    const isStudents = c.students.some(({ id }) => id === user.id)

    if (isTeacher || isStudents) {
      throw new BadRequestException('User has already joined the class')
    }

    const code = await this.codeRepo.findOne({ where: { id: dto.token } })
    if (!code) {
      throw new BadRequestException('Token is invalid')
    }

    if (!code.emails.some((email) => email === req.user.email)) {
      throw new BadRequestException('Token is invalid')
    }

    if (code.expire && moment().isSameOrAfter(code.expire)) {
      await this.codeRepo.remove(code)
      throw new BadRequestException('Token is invalid')
    }

    code.emails = code.emails.filter(email => email !== user.email)
    if (code.type === CodeType.Student) {
      c.students = [...c.students, user]
    } else {
      c.teachers = [...c.teachers, user]
    }

    const [newC] = await Promise.all([
      this.classRepo.save(c),
      code.emails.length > 0 ? this.codeRepo.save(code) : this.codeRepo.remove(code),
    ])

    return newC
  }
}
