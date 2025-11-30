import { Injectable } from '@nestjs/common';
import { GmailService } from '../gmail/gmail.service';
import { ThreadDetailDto } from './dto/thread-detail.dto';
import { parseEmailDetail } from 'src/utils/email.util';

@Injectable()
export class ThreadService {
  constructor(private readonly gmailService: GmailService) {}

  async getThreadDetail(
    userId: number,
    threadId: string,
  ): Promise<ThreadDetailDto> {
    const thread = await this.gmailService.getThread(userId, threadId);
    const messages = (thread.messages || []).map((message) =>
      parseEmailDetail(message),
    );

    return {
      id: thread.id!,
      snippet: thread.snippet || '',
      historyId: thread.historyId || '',
      messages,
    };
  }
}
