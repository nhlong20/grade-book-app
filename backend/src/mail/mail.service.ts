import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

const FE = process.env.FE_URL
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendMail(option: ISendMailOptions) {
    return this.mailerService.sendMail(option)
  }

  sendActivationEmail(to: string, token: string) {
    return this.mailerService.sendMail({
      to,
      subject: 'Activate your account at GradeBook',
      html: `
        <div>
          Click the link below to activate your account<br/>
          <a href="${FE + '/activate?token=' + token}">Activate</a>
        </div>
      `,
    })
  }

  sendResetPasswordEmail(to: string, token: string) {
    return this.mailerService.sendMail({
      to,
      subject: 'Reset your password at GradeBook',
      html: `
        <div>
          Click the link below to reset your passwordj<br/>
          <a href="${FE + '/reset?token=' + token}">Activate</a>
        </div>
      `,
    })
  }
}

