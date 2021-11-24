import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  sendMail(option: ISendMailOptions) {
    return this.mailerService.sendMail(option)
  }
}
