import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from '../auth/guards/at.guard';
import { EmailService } from './email.service';
import { ApiSecurity } from '@nestjs/swagger';
import { ModifyEmailDto } from 'src/email/dto/modify-email.dto';

@Controller('emails')
@UseGuards(AtGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get(':id')
  @ApiSecurity('jwt')
  async getEmailDetail(@Req() req, @Param('id') id: string) {
    return this.emailService.getEmailDetail(req.user.sub, id);
  }

  @Post(':id/modify')
  @ApiSecurity('jwt')
  async modifyEmail(
    @Req() req,
    @Param('id') emailId: string,
    @Body() modifyDto: ModifyEmailDto,
  ) {
    return this.emailService.modifyEmail(req.user.sub, emailId, modifyDto);
  }

  @Post(':id/mark-as-read')
  @ApiSecurity('jwt')
  async markAsRead(@Req() req, @Param('id') emailId: string) {
    return this.emailService.markAsRead(req.user.sub, emailId);
  }

  @Post(':id/mark-as-unread')
  @ApiSecurity('jwt')
  async markAsUnread(@Req() req, @Param('id') emailId: string) {
    return this.emailService.markAsUnread(req.user.sub, emailId);
  }

  @Post(':id/star')
  @ApiSecurity('jwt')
  async starEmail(@Req() req, @Param('id') emailId: string) {
    return this.emailService.starEmail(req.user.sub, emailId);
  }

  @Post(':id/unstar')
  @ApiSecurity('jwt')
  async unstarEmail(@Req() req, @Param('id') emailId: string) {
    return this.emailService.unstarEmail(req.user.sub, emailId);
  }

  @Post(':id/move-to-trash')
  @ApiSecurity('jwt')
  async moveToTrash(@Req() req, @Param('id') emailId: string) {
    return this.emailService.moveToTrash(req.user.sub, emailId);
  }

  @Post(':id/move-to-inbox')
  @ApiSecurity('jwt')
  async moveToInbox(@Req() req, @Param('id') emailId: string) {
    return this.emailService.moveToInbox(req.user.sub, emailId);
  }

  @Post(':id/archive')
  @ApiSecurity('jwt')
  async archiveEmail(@Req() req, @Param('id') emailId: string) {
    return this.emailService.archiveEmail(req.user.sub, emailId);
  }

  @Post(':id/untrash')
  @ApiSecurity('jwt')
  async untrashEmail(@Req() req, @Param('id') emailId: string) {
    return this.emailService.untrashEmail(req.user.sub, emailId);
  }
}
