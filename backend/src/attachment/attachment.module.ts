import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { GmailModule } from 'src/gmail/gmail.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [GmailModule, EmailModule],
  controllers: [AttachmentController],
  providers: [AttachmentService],
})
export class AttachmentModule {}
