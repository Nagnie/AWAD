import { EmailDetailDto } from '../../email/dto/email-detail.dto';

export class ThreadDetailDto {
  id: string;
  snippet: string;
  historyId: string;
  messages: EmailDetailDto[];
}
