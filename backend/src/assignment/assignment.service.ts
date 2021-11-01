import { DTO } from '@/type'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Assignment } from './assignment.entity'

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepo: Repository<Assignment>,
  ) { }

  create(dto: DTO.Assignment.Create) {
    return this.assignmentRepo.save(dto)
  }

  async updateAssignmentPercentage(
    id: string,
    dto: DTO.Assignment.UpdatePercentage,
  ) {
    const assignment = await this.assignmentRepo.findOne(id)
    if (!assignment) throw new BadRequestException('Assignment does not exist')

    const assignments = await this.assignmentRepo.find({
      classId: assignment.classId,
    })

    const totalPercentage = assignments.reduce(
      (sum, curr) =>
        sum + curr.id === assignment.id ? dto.percentage : curr.percentage,
      0,
    )

    if (totalPercentage > 100)
      throw new BadRequestException('Total percentage can not exceed 100')

    assignment.percentage = dto.percentage
    return await this.assignmentRepo.save(assignment)
  }
}
