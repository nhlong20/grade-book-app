import { Class } from '@/class/class.entity'
import { NotiService } from '@/noti/noti.service'
import { DTO } from '@/type'
import { CreateNotification } from '@/type/dto/noti'
import { CreateNotiMessage } from '@/type/dto/notiMessage'
import { User } from '@/user/user.entity'
import { AuthRequest } from '@/utils/interface'
import {
  BadRequestException,
  ForbiddenException,
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

    console.log(review.grade.student.class.teachers)
    console.log(req.user.id)

    if (!review) throw new BadRequestException('review not found')
    if (
      !review.grade.student.class.teachers.some(
        ({ id }) => id === req.user.id,
      ) &&
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

    let result = await this.reviewRepo.save({
      ownerId: req.user.id,
      ...dto,
    })

    const newReview = await this.getOneReview(result.id, req)

    let receivers = newReview?.grade?.student?.class?.teachers
    let title = 'Review request'
    let body = req.user.name + ' has requested a review'

    this.genReviewNotification(req, newReview, title, body, receivers)

    return result
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
      ) &&
      review.owner.id !== req.user.id
    )
      throw new ForbiddenException('You can not do this')

    const teacher: User = review?.grade?.student?.class?.teachers?.find(
      (teacher) => teacher.id === req.user.id,
    )
    let receivers = [review.owner]
    if (teacher != undefined && teacher != null) {
      receivers = review.grade.student.class.teachers
    }
    let title = 'Review Comment'
    let body = teacher?.name || req.user.name + ' commented on a review'
    this.genReviewNotification(req, review, title, body, receivers)

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
      ) &&
      review.owner.id !== req.user.id
    )
      throw new ForbiddenException('You can not do this')

    review.formerGrade = review.grade.point
    review.grade.point = review.expectedGrade

    const teacher: User = review.grade.student.class.teachers.find(
      (teacher) => teacher.id === req.user.id,
    )
    const receivers = [review.owner]
    const title = 'Review Resolved'
    let body = teacher?.name + ' has resolved your mark review'
    this.genReviewNotification(req, review, title, body, receivers)

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

  async genReviewNotification(
    req: AuthRequest,
    review: Review,
    title: string,
    body: string,
    receivers: User[],
  ) {
    // Create Notification Message
    const notiMsg = new CreateNotiMessage()
    notiMsg.title = title
    notiMsg.body = body
    notiMsg.sourceId = review.id
    notiMsg.sourceType = 'Review'
    const newNotiMsg = await this.notiService.createNotiMessage(notiMsg)

    // Create Noti
    const noti = new CreateNotification()
    noti.messageId = newNotiMsg.id
    noti.receivers = receivers

    await this.notiService.createNoti(noti, req)
  }
}
