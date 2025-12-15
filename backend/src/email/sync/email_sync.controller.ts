import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guards/at.guard';
import { EmailSynceService } from './email_sync.service';

@Controller('email')
@ApiTags('Emails')
@UseGuards(AtGuard)
export class EmailSyncController {
  constructor(private readonly emailSyncService: EmailSynceService) {}

  @Get('sync')
  @ApiSecurity('jwt')
  syncEmails(@Req() req) {
    return this.emailSyncService.syncEmailsForUser(req.user.sub);
  }
}
