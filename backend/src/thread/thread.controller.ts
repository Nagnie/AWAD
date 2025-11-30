import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AtGuard } from '../auth/guards/at.guard';
import { ThreadService } from './thread.service';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { ThreadDetailDto } from './dto/thread-detail.dto';

@Controller('threads')
@UseGuards(AtGuard)
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Get(':id')
  @ApiSecurity('jwt')
  @ApiOperation({
    summary: 'Get thread detail with all messages',
    description: 'Returns full conversation thread with all reply messages',
  })
  async getThread(
    @Req() req,
    @Param('id') threadId: string,
  ): Promise<ThreadDetailDto> {
    return this.threadService.getThreadDetail(req.user.sub, threadId);
  }
}
