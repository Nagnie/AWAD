import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAttachmentData } from './interfaces/attachment-data.interfaces';
import { GmailService } from '../gmail/gmail.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AttachmentService {
  constructor(
    private readonly gmailService: GmailService,
    private readonly emailService: EmailService,
  ) {}

  async getAttachment(
    userId: number,
    messageId: string,
    attachmentId: string,
  ): Promise<IAttachmentData> {
    const attachmentData = await this.gmailService.getAttachment(
      userId,
      messageId,
      attachmentId,
    );

    if (!attachmentData || !attachmentData.data) {
      throw new NotFoundException('Attachment data not found');
    }

    const buffer = this.decodeBase64Url(attachmentData.data);

    return {
      buffer,
      size: buffer.length,
    };
  }

  private decodeBase64Url(data: string): Buffer {
    try {
      // Convert base64url to standard base64
      // RFC 4648: base64url uses - instead of + and _ instead of /
      let base64 = data.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding if needed (base64 length must be multiple of 4)
      // RFC 4648 allows omitting padding, but Buffer.from needs it
      const padLength = (4 - (base64.length % 4)) % 4;
      base64 += '='.repeat(padLength);

      // Decode base64 to Buffer
      const buffer = Buffer.from(base64, 'base64');
      return buffer;
    } catch (error) {
      console.error('Base64 decode error:', error);
      console.error('Input length:', data.length);
      console.error('First 100 chars:', data.substring(0, 100));
      throw new BadRequestException('Failed to decode attachment data');
    }
  }
}
