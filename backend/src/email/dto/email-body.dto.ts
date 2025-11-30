import { EmailAttachmentDto } from './email-attachment.dto';

export class EmailBodyDto {
  htmlBody?: string;
  textBody?: string;
  attachments: EmailAttachmentDto[];
}
