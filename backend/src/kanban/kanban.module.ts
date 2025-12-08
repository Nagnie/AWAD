import { Module } from '@nestjs/common';
import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';
import { GmailModule } from '../gmail/gmail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailPriority } from '../email/entities/email-priority.entity';
import { EmailSummary } from '../email/entities/email-summary.entity';
import { EmailKanbanOrder } from '../email/entities/email-kanban-order.entity';

@Module({
  imports: [
    GmailModule,
    TypeOrmModule.forFeature([EmailPriority, EmailSummary, EmailKanbanOrder]),
  ],
  controllers: [KanbanController],
  providers: [KanbanService],
})
export class KanbanModule {}
