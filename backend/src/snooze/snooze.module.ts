import { Module } from '@nestjs/common';
import { SnoozeService } from './snooze.service';
import { GmailModule } from '../gmail/gmail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailSnooze } from '../email/entities/email-snooze.entity';

@Module({
  imports: [GmailModule, TypeOrmModule.forFeature([EmailSnooze])],
  providers: [SnoozeService],
  exports: [SnoozeService],
})
export class SnoozeModule {}
