export interface IEmailAttachment {
  filename: string;
  mimeType: string;
  size: number;
  attachmentId?: string;
  inlineData?: string;
}

export interface IParsedMessageParts {
  htmlBody: string;
  textBody: string;
  attachments: IEmailAttachment[];
}
