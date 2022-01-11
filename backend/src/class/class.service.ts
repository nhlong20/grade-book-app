import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Class, Code, CodeType, GradeStructure } from './class.entity'
import { User } from '@/user/user.entity'
import { paginate } from 'nestjs-typeorm-paginate'
import { MailService } from '@/mail/mail.service'
import moment from 'moment'
import { randomBytes } from 'crypto'

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class) private readonly classRepo: Repository<Class>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Code) private readonly codeRepo: Repository<Code>,
    @InjectRepository(GradeStructure)
    private readonly gradeStructureRepo: Repository<GradeStructure>,
    private readonly mailService: MailService,
  ) {}

  async create(dto: DTO.Class.CCreate, req: AuthRequest) {
    const user = await this.userRepo.findOne({
      where: { email: req.user.email },
    })

    if (!user) throw new BadRequestException('User does not exist')

    return this.classRepo.save({
      ...dto,
      teachers: [user],
    })
  }

  getMany(query: DTO.Class.CGetManyQuery) {
    let qb = this.classRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.teachers', 'teachers')
      .leftJoinAndSelect('c.students', 'students')

    if (query.query) {
      qb = qb.andWhere('to_tsvector(c.name) @@ plainto_tsquery(:query)', {
        query: query.query,
      })
    }

    return paginate(qb, { limit: query.limit, page: query.page })
  }

  async updateOrder(dto: DTO.Class.UpdateOrder) {
    const [a1, a2] = await Promise.all([
      this.gradeStructureRepo.findOne(dto.id1),
      this.gradeStructureRepo.findOne(dto.id2),
    ])

    if (!a1 || !a2) throw new BadRequestException('Struct does not exist')

    const a2order = a2.order

    a2.order = a1.order
    a1.order = a2order

    return Promise.all([
      this.gradeStructureRepo.save(a1),
      this.gradeStructureRepo.save(a2),
    ])
  }

  async getOne(dto: DTO.Class.CGetOne, req?: AuthRequest) {
    const [c, user] = await Promise.all([
      this.classRepo.findOne({
        where: { id: dto.id },
        relations: ['teachers', 'students', 'gradeStructure'],
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
            html:
              process.env.FE_URL +
              '/invite?token=' +
              code.id +
              '&accessId=' +
              classId,
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

    code.emails = code.emails.filter((email) => email !== user.email)
    if (code.type === CodeType.Student) {
      c.students = [...c.students, user]
    } else {
      c.teachers = [...c.teachers, user]
    }

    const [newC] = await Promise.all([
      this.classRepo.save(c),
      code.emails.length > 0
        ? this.codeRepo.save(code)
        : this.codeRepo.remove(code),
    ])

    return newC
  }

  async creatGradeStructure(
    classId: string,
    dto: DTO.Class.CreateGradeStructure,
  ) {
    const maxOrder: number = (
      await this.gradeStructureRepo
        .createQueryBuilder('g')
        .select('MAX(g.order)', 'max')
        .getRawOne()
    ).max

    const clazz = await this.classRepo.findOne({
      where: { id: classId },
    })

    if (!clazz) throw new BadRequestException('Class does not exist')

    return this.gradeStructureRepo.save({
      ...dto,
      order: maxOrder + 1,
      class: clazz,
    })
  }

  getManyGradeStructure(classId: string) {
    return this.gradeStructureRepo.find({
      where: { classId },
    })
  }

  async patchGradeStructure(
    gradeStructureId: string,
    dto: DTO.Class.CreateGradeStructure,
  ) {
    const gradeStruct = await this.gradeStructureRepo.findOne({
      where: { id: gradeStructureId },
    })
    if (!gradeStruct)
      throw new BadRequestException('Grade Struct does not exist')

    return this.gradeStructureRepo.save({ ...gradeStruct, ...dto })
  }

  async deleteGradeStructure(gradeStructureId: string) {
    const gradeStruct = await this.gradeStructureRepo.findOne({
      where: { id: gradeStructureId },
    })
    if (!gradeStruct)
      throw new BadRequestException('Grade Struct does not exist')

    return this.gradeStructureRepo.remove(gradeStruct)
  }

  async generateInviteToken(classId: string, req: AuthRequest) {
    const clas = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['teachers'],
    })

    if (!clas.teachers.some((user) => user.id === req.user.id)) {
      throw new BadRequestException('you can not do this')
    }

    const token = randomBytes(10).toString('base64url')

    return this.classRepo.save({
      ...clas,
      token,
    })
  }
}
