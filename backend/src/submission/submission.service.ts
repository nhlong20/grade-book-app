import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CsvParser } from 'nest-csv-parser'
import { Repository } from 'typeorm'
import { Submission } from './submission.entity'
import * as fs from 'fs'

class Entity {
  email: string
  score: number
}

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
    private readonly csvParser: CsvParser,
  ) { }

  create(req: AuthRequest, dto: DTO.Submission.Create) {
    return this.submissionRepo.save({
      ...dto,
      ownerId: req.user.sub,
    })
  }

  async getOne(req: AuthRequest, submissionId: string) {
    const submission = await this.submissionRepo.find({
      id: submissionId,
      ownerId: req.user.sub,
    })
    if (!submission) throw new BadRequestException('Submission does not exist')

    return submission
  }

  getManyByAssignmentId(assignmentId: string) {
    return this.submissionRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.owner', 'owner')
      .where('a.assignment_id=:id', { id: assignmentId })
      .getMany()
  }

  getManyByClassId(classId: string) {
    return this.submissionRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.owner', 'owner')
      .leftJoinAndSelect('a.class', 'class')
      .where('a.class.id=:id', { id: classId })
      .getMany()
  }

  async bulkUpdateScore(fileBuffer: Buffer) {
    const stream = fs.createReadStream(fileBuffer)
    const entities: Entity[] = (await this.csvParser.parse(
      stream,
      Entity,
    )) as any

    const submissions = await this.submissionRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('u.owner', 'owner')
      .where('u.owner.email IN (:email)', {
        email: entities.map((e) => e.email),
      })
      .getMany()

    submissions.forEach((s) => {
      const newScore = entities.find((e) => e.email === s.owner.email)?.score
      if (!newScore) throw new InternalServerErrorException()
      s.score = newScore
    })

    return await Promise.all(
      submissions.map((s) => this.submissionRepo.save(s)),
    )
  }
}
