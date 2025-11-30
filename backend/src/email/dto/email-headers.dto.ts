export class EmailHeadersDto {
  subject: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  date: string;
  replyTo?: string;
}
