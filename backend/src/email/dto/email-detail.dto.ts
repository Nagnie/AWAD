import { EmailHeadersDto } from './email-headers.dto';
import { EmailBodyDto } from './email-body.dto';

export class EmailDetailDto {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  headers: EmailHeadersDto;
  body: EmailBodyDto;
  isUnread: boolean;
  isStarred: boolean;
  isImportant: boolean;
  internalDate: string;
  sizeEstimate: number;
}
