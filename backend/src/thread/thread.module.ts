import { Module } from '@nestjs/common';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { GmailModule } from 'src/gmail/gmail.module';

@Module({
  imports: [GmailModule],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}
