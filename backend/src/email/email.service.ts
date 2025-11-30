import { BadRequestException, Injectable } from '@nestjs/common';
import { GmailService } from '../gmail/gmail.service';
import { parseEmailDetail, hasAttachments } from '../utils/email.util';
import { gmail_v1 } from 'googleapis';
import { EmailDetailDto } from 'src/email/dto/email-detail.dto';
import { ModifyEmailDto } from 'src/email/dto/modify-email.dto';

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

  async modifyEmail(
    userId: number,
    emailId: string,
    modifyDto: ModifyEmailDto,
  ) {
    if (!modifyDto.addLabelIds && !modifyDto.removeLabelIds) {
      throw new BadRequestException(
        'Must provide at least addLabelIds or removeLabelIds',
      );
    }

    const requestBody: gmail_v1.Schema$ModifyMessageRequest = {
      addLabelIds: modifyDto.addLabelIds,
      removeLabelIds: modifyDto.removeLabelIds,
    };

    const modifiedMessage = await this.gmailService.modifyMessage(
      userId,
      emailId,
      requestBody,
    );

    const parsedMessage = parseEmailDetail(modifiedMessage);

    return parsedMessage;
  }

  async markAsRead(userId: number, emailId: string): Promise<EmailDetailDto> {
    return this.modifyEmail(userId, emailId, {
      removeLabelIds: ['UNREAD'],
    });
  }

  async markAsUnread(userId: number, emailId: string): Promise<EmailDetailDto> {
    return this.modifyEmail(userId, emailId, {
      addLabelIds: ['UNREAD'],
    });
  }

  async starEmail(userId: number, emailId: string): Promise<EmailDetailDto> {
    return this.modifyEmail(userId, emailId, {
      addLabelIds: ['STARRED'],
    });
  }

  async unstarEmail(userId: number, emailId: string): Promise<EmailDetailDto> {
    return this.modifyEmail(userId, emailId, {
      removeLabelIds: ['STARRED'],
    });
  }

  async moveToTrash(userId: number, emailId: string): Promise<EmailDetailDto> {
    // return this.modifyEmail(userId, emailId, {
    //   addLabelIds: ['TRASH'],
    //   removeLabelIds: ['INBOX'],
    // });

    const trashedMessage = await this.gmailService.moveMessageToTrash(
      userId,
      emailId,
    );

    const parsedMessage = parseEmailDetail(trashedMessage);

    return parsedMessage;
  }

  async moveToInbox(userId: number, emailId: string): Promise<EmailDetailDto> {
    return this.modifyEmail(userId, emailId, {
      addLabelIds: ['INBOX'],
      removeLabelIds: ['TRASH', 'SPAM'],
    });
  }

  async untrashEmail(userId: number, emailId: string): Promise<EmailDetailDto> {
    const untrashedMessage = await this.gmailService.untrashMessage(
      userId,
      emailId,
    );
    const parsedMessage = parseEmailDetail(untrashedMessage);
    return parsedMessage;
  }

  async archiveEmail(userId: number, emailId: string): Promise<EmailDetailDto> {
    return this.modifyEmail(userId, emailId, {
      removeLabelIds: ['INBOX'],
    });
  }

  hasAttachments(payload: gmail_v1.Schema$MessagePart) {
    return hasAttachments(payload);
  }
}
