import { EmailSummaryDto } from './email-summary.dto';

export class EmailListResponseDto {
  nextPageToken?: string;
  resultSizeEstimate?: number;
  emails: EmailSummaryDto[];
}
