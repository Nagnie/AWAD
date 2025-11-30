import { Module } from '@nestjs/common';
import { MailboxController } from './mailbox.controller';
import { MailboxService } from './mailbox.service';
import { GmailModule } from '../gmail/gmail.module';

@Module({
  imports: [
    GmailModule
  ],
  controllers: [MailboxController],
  providers: [MailboxService]
})
export class MailboxModule {}
