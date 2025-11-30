import { Injectable } from '@nestjs/common';
import { GmailService } from '../gmail/gmail.service';
import { parseEmailDetail, hasAttachments } from '../utils/email.util';
import { gmail_v1 } from 'googleapis';
import { EmailDetailDto } from 'src/email/dto/email-detail.dto';

@Injectable()
export class EmailService {
  constructor(private readonly gmailService: GmailService) {}

  async getEmailDetail(
    userId: number,
    emailId: string,
  ): Promise<EmailDetailDto> {
    const message = await this.gmailService.getMessage(userId, emailId);

    const parsedMessage = parseEmailDetail(message);

    return parsedMessage;
  }

  hasAttachments(payload: gmail_v1.Schema$MessagePart) {
    return hasAttachments(payload);
  }
}
