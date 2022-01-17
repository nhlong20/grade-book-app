import { Class } from '@/class/class.entity'
import { NotiService } from '@/noti/noti.service'
import { DTO } from '@/type'
import { CreateNotification } from '@/type/dto/noti'
import { CreateNotiMessage } from '@/type/dto/notiMessage'
import { AuthRequest } from '@/utils/interface'
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Comment, Review } from './review.entity'

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Class) private classRepo: Repository<Class>,
    private readonly notiService: NotiService,
  ) {}

  async getManyReview(classId: string, req: AuthRequest) {
    const clas = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['teachers'],
    })
    if (!clas) throw new BadRequestException()

    if (clas.teachers.some((u) => u.id === req.user.id)) {
      return this.reviewRepo.find({
        relations: ['grade', 'grade.struct', 'owner'],
        order: {
          createdAt: 'ASC',
        },
      })
    }

    throw new BadRequestException('You can not do this')
  }

  async getOneReview(id: string, req: AuthRequest) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: [
        'grade',
        'grade.struct',
        'grade.student',
        'grade.student.class',
        'grade.student.class.teachers',
        'owner',
        'comments',
        'comments.author',
      ],
    })

    if (!review) throw new BadRequestException('review not found')
    if (
      !review.grade.student.class.teachers.some(
        ({ id }) => id === req.user.id,
      ) ||
      review.owner.id !== req.user.id
    )
      throw new ForbiddenException('You can not do this')

    return review
  }

  async createReview(dto: DTO.Review.CreateReview, req: AuthRequest) {
    const review = await this.reviewRepo.findOne({
      where: { gradeId: dto.gradeId, ownerId: req.user.id },
    })

    if (review) throw new BadRequestException('Review existed')

    return this.reviewRepo.save({
      ownerId: req.user.id,
      ...dto,
    })
  }

  async createComment(dto: DTO.Comment.CreateComment, req: AuthRequest) {
    const review = await this.reviewRepo.findOne({
      where: { id: dto.reviewId },
      relations: [
        'grade',
        'grade.struct',
        'grade.student',
        'grade.student.class',
        'grade.student.class.teachers',
        'owner',
        'comments',
      ],
    })

    if (
      !review.grade.student.class.teachers.some(
        ({ id }) => id === req.user.id,
      ) ||
      review.owner.id !== req.user.id
    )
      throw new ForbiddenException('You can not do this')

    return this.commentRepo.save({
      authorId: req.user.id,
      ...dto,
    })
  }

  async resolveReview(id: string, req: AuthRequest) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: [
        'grade',
        'grade.struct',
        'grade.student',
        'grade.student.class',
        'grade.student.class.teachers',
        'owner',
        'comments',
      ],
    })

    if (!review) throw new BadRequestException('review not found')
    if (
      !review.grade.student.class.teachers.some(
        ({ id }) => id === req.user.id,
      ) ||
      review.owner.id !== req.user.id
    )
      throw new ForbiddenException('You can not do this')

    review.formerGrade = review.grade.point
    review.grade.point = review.expectedGrade

    // Create Notification Message
    let teacher = review.grade.student.class.teachers.find(teacher => teacher.id === req.user.id )
    const notiMsg = new CreateNotiMessage()
    notiMsg.title = "Mark review"
    notiMsg.body = teacher.name + "has resolved your mark review"
    notiMsg.sourceId = review.id
    notiMsg.sourceType = typeof (review)
    const newNotiMsg = await this.notiService.createNotiMessage(notiMsg)

    // Create Noti
    const noti = new CreateNotification()
    noti.messageId = newNotiMsg.id
    const newNoti = await this.notiService.createNoti(noti, req)

    return this.reviewRepo.save({
      ...review,
      resolved: true,
    })
  }

  async unresolveReview(id: string, req: AuthRequest) {
    const review = await this.reviewRepo.findOne({
      where: { id },
      relations: ['owner', 'comments'],
    })

    if (!review) throw new BadRequestException('review not found')
    if (review.owner.id !== req.user.id)
      throw new ForbiddenException('You can not do this')

    review.grade.point = review.formerGrade
    review.formerGrade = null

    return this.reviewRepo.save({
      ...review,
      resolved: false,
    })
  }
}
