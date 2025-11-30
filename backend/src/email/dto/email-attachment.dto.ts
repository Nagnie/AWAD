export class EmailAttachmentDto {
  filename: string;
  mimeType: string;
  size: number;
  attachmentId?: string;
  inlineData?: string;
}
