import { DTO } from '@/type'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Subject } from './subject.entity'

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
  ) { }

  async create(dto: DTO.Subject.SubjectCreate) {
    const subject = await this.subjectRepo.findOne({ name: dto.name })
    if (!subject) throw new BadRequestException('Subject already exists')

    return this.subjectRepo.save(dto)
  }

  getMany() {
    return this.subjectRepo.find()
  }
}
