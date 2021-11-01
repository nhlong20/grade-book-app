import { DTO } from '@/type'
import { AuthRequest } from '@/utils/interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Submission } from './submission.entity'

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
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
      .execute()
  }

  getManyByClassId(classId: string) {
    return this.submissionRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.owner', 'owner')
      .leftJoinAndSelect('a.class', 'class')
      .where('a.class.id=:id', { id: classId })
      .execute()
  }
}
