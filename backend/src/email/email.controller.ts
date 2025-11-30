import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AtGuard } from '../auth/guards/at.guard';
import { EmailService } from './email.service';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('emails')
@UseGuards(AtGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get(':id')
  @ApiSecurity('jwt')
  async getEmailDetail(@Req() req, @Param('id') id: string) {
    return this.emailService.getEmailDetail(req.user.sub, id);
  }
}
