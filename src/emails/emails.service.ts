import got from 'got';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { Inject, Injectable } from '@nestjs/common';
import { EmailModuleOptions } from './interfaces/emails.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailsService {
  constructor(
    @Inject('OPTIONS') private readonly options: EmailModuleOptions,
    private readonly configService: ConfigService,
  ) {
    this.sendEmail('Email testing for Mailgun', 'test text');
  }

  private sendEmail(subject: string, text: string) {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: this.configService.get<string>('MAILGUN_APIKEY'),
    });
    mg.messages
      .create(this.configService.get<string>('MAILGUN_DOMAIN_NAME'), {
        from: `FitMe NoReply <mailgun@${this.configService.get<string>(
          'MAILGUN_DOMAIN_NAME',
        )}>`,
        to: [this.configService.get<string>('MAILGUN_TEST_TO')],
        subject: 'Test Email',
        text: 'Hello',
        template: 'email-verification',
        'v:my-var': 'v:code',
      })
      .then((msg) => console.log(msg))
      .catch((error) => console.log(error));
  }
}
