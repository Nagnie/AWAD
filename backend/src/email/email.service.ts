import { BadRequestException, Injectable } from '@nestjs/common';
import { GmailService } from '../gmail/gmail.service';
import { parseEmailDetail, hasAttachments } from '../utils/email.util';
import { gmail_v1 } from 'googleapis';
import { EmailDetailDto } from 'src/email/dto/email-detail.dto';
import { ModifyEmailDto } from 'src/email/dto/modify-email.dto';
import { DeleteBatchEmailDto } from 'src/email/dto/delete-batch-email.dto';
import { SendEmailDto } from 'src/email/dto/send-email.dto';

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

  async deleteEmail(userId: number, emailId: string): Promise<void> {
    await this.gmailService.deleteMessage(userId, emailId);
  }

  async batchDeleteEmails(
    userId: number,
    deleteBatchEmailDto: DeleteBatchEmailDto,
  ): Promise<void> {
    if (deleteBatchEmailDto.ids.length === 0) {
      throw new BadRequestException('No email IDs provided for deletion');
    }

    await this.gmailService.batchDeleteMessages(
      userId,
      deleteBatchEmailDto.ids,
    );
  }

  async sendEmail(userId: number, sendEmailDto: SendEmailDto) {
    // Validate at least one recipient
    if (!sendEmailDto.to || sendEmailDto.to.length === 0) {
      throw new BadRequestException('At least one recipient is required');
    }

    const rawMessage = this.buildRFC822Message(sendEmailDto);

    const encodedMessage = this.encodeBase64Url(rawMessage);

    const sentMessage = await this.gmailService.sendEmail(
      userId,
      encodedMessage,
      sendEmailDto.threadId,
    );

    const parsedMessage = parseEmailDetail(sentMessage);

    return parsedMessage;
  }

  private buildRFC822Message(sendDto: SendEmailDto): string {
    const boundary = this.generateBoundary();
    const lines: string[] = [];

    // Headers
    lines.push(`To: ${sendDto.to.join(', ')}`);

    if (sendDto.cc && sendDto.cc.length > 0) {
      lines.push(`Cc: ${sendDto.cc.join(', ')}`);
    }

    if (sendDto.bcc && sendDto.bcc.length > 0) {
      lines.push(`Bcc: ${sendDto.bcc.join(', ')}`);
    }

    lines.push(`Subject: ${sendDto.subject}`);
    lines.push('MIME-Version: 1.0');

    // Check if multipart (has attachments or both text and HTML)
    const hasAttachments =
      sendDto.attachments && sendDto.attachments.length > 0;
    const hasBothBodies = sendDto.textBody && sendDto.htmlBody;

    if (hasAttachments) {
      // Multipart mixed (for attachments)
      lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
      lines.push('');

      // Body part
      if (hasBothBodies) {
        lines.push(`--${boundary}`);
        lines.push(
          `Content-Type: multipart/alternative; boundary="${boundary}_alt"`,
        );
        lines.push('');

        // Text version
        lines.push(`--${boundary}_alt`);
        lines.push('Content-Type: text/plain; charset="UTF-8"');
        lines.push('');
        lines.push(sendDto.textBody!);
        lines.push('');

        // HTML version
        lines.push(`--${boundary}_alt`);
        lines.push('Content-Type: text/html; charset="UTF-8"');
        lines.push('');
        lines.push(sendDto.htmlBody!);
        lines.push('');
        lines.push(`--${boundary}_alt--`);
      } else {
        // Single body type
        lines.push(`--${boundary}`);
        if (sendDto.htmlBody) {
          lines.push('Content-Type: text/html; charset="UTF-8"');
          lines.push('');
          lines.push(sendDto.htmlBody);
        } else {
          lines.push('Content-Type: text/plain; charset="UTF-8"');
          lines.push('');
          lines.push(sendDto.textBody!);
        }
        lines.push('');
      }

      // Attachments
      for (const attachment of sendDto.attachments!) {
        lines.push(`--${boundary}`);
        lines.push(
          `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"`,
        );
        lines.push(
          `Content-Disposition: attachment; filename="${attachment.filename}"`,
        );
        lines.push('Content-Transfer-Encoding: base64');
        lines.push('');
        lines.push(attachment.data);
        lines.push('');
      }

      lines.push(`--${boundary}--`);
    } else if (hasBothBodies) {
      // Multipart alternative (text + HTML, no attachments)
      lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
      lines.push('');

      // Text version
      lines.push(`--${boundary}`);
      lines.push('Content-Type: text/plain; charset="UTF-8"');
      lines.push('');
      lines.push(sendDto.textBody!);
      lines.push('');

      // HTML version
      lines.push(`--${boundary}`);
      lines.push('Content-Type: text/html; charset="UTF-8"');
      lines.push('');
      lines.push(sendDto.htmlBody!);
      lines.push('');

      lines.push(`--${boundary}--`);
    } else {
      // Simple message (single body type, no attachments)
      if (sendDto.htmlBody) {
        lines.push('Content-Type: text/html; charset="UTF-8"');
        lines.push('');
        lines.push(sendDto.htmlBody);
      } else {
        lines.push('Content-Type: text/plain; charset="UTF-8"');
        lines.push('');
        lines.push(sendDto.textBody!);
      }
    }

    return lines.join('\r\n');
  }

  private generateBoundary(): string {
    return `----=_Part_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private encodeBase64Url(data: string): string {
    // Convert to Buffer
    const buffer = Buffer.from(data, 'utf-8');

    // Encode to base64
    let base64 = buffer.toString('base64');

    // Convert to base64url (URL-safe)
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    return base64;
  }

  hasAttachments(payload: gmail_v1.Schema$MessagePart) {
    return hasAttachments(payload);
  }
}
