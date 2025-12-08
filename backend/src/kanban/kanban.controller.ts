import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AtGuard } from '../auth/guards/at.guard';
import { KanbanService } from './kanban.service';
import { ApiOperation, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { KanbanColumnId } from './dto/kanban-column.dto';
import { GetColumnQueryDto } from './dto/get-column.dto';

@Controller('emails/kanban')
@UseGuards(AtGuard)
export class KanbanController {
  constructor(private readonly kanbanService: KanbanService) {}

  @Get('columns')
  @ApiSecurity('jwt')
  @ApiOperation({
    summary: 'Get all column metadata',
    description: 'Get basic info about all Kanban columns (without emails)',
  })
  getColumnsMetadata() {
    return this.kanbanService.getColumnsMetadata();
  }

  @Get('columns/:columnId')
  @ApiSecurity('jwt')
  @ApiOperation({
    summary: 'Get single Kanban column with emails',
    description:
      'Fetch emails for a specific column with filtering and pagination',
  })
  @ApiParam({
    name: 'columnId',
    enum: KanbanColumnId,
  })
  async getColumn(
    @Req() req,
    @Param('columnId') columnId: KanbanColumnId,
    @Query() query: GetColumnQueryDto,
  ) {
    return this.kanbanService.getKanbanColumn(req.user.sub, columnId, query);
  }
}
