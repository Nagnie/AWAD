import { EmailHeaderDto } from './email-header.dto';

export class EmailSummaryDto {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  header: EmailHeaderDto;
  isUnread: boolean;
  isStarred: boolean;
  isImportant: boolean;
  internalDate: string;
  sizeEstimate: number;
}
