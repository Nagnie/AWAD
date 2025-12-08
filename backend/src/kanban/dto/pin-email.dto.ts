import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { KanbanColumnId } from 'src/kanban/dto/kanban-column.dto';

export class PinEmailDto {
  @ApiProperty({
    description: 'Column ID (currently only supports inbox)',
    example: 'inbox',
  })
  @IsString()
  columnId: KanbanColumnId;

  @ApiPropertyOptional({
    description: 'Position within pinned section (0 = top)',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  position?: number;
}

export class SetPriorityDto {
  @ApiProperty({
    description: 'Priority level (0 = normal, 1 = high, 2 = urgent)',
    example: 1,
    minimum: 0,
    maximum: 2,
  })
  @IsNumber()
  @Min(0)
  priorityLevel: number;
}

export class PinResponseDto {
  @ApiProperty({
    description: 'Email ID',
    example: '18d8f2a3b4c5d6e7',
  })
  emailId: string;

  @ApiProperty({
    description: 'Is pinned',
    example: true,
  })
  isPinned: boolean;

  @ApiProperty({
    description: 'Pinned order',
    example: 0,
  })
  pinnedOrder: number;

  @ApiProperty({
    description: 'Priority level',
    example: 1,
  })
  priorityLevel: number;
}
