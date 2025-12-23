import { ColumnResponseDto } from 'src/kanban/dto/column-management.dto';
import { KanbanColumnConfig } from 'src/kanban/entities/kanban-column-config.entity';

export function mapToColumnResponse(
  column: KanbanColumnConfig,
): ColumnResponseDto {
  return {
    id: column.id,
    name: column.name,
    gmailLabel: column.gmailLabel || '',
    gmailLabelName: column.gmailLabelName || '',
    order: column.order,
    hasEmailSync: column.hasEmailSync,
    isActive: column.isActive,
    createdAt: column.createdAt,
    updatedAt: column.updatedAt,
  };
}

export function formatColumnsResponse(columns: KanbanColumnConfig[]): {
  columns: {
    [key: number]: {
      id: number;
      name: string;
      labelIds: string[];
      order: number;
      count: number;
    };
  };
} {
  const formattedColumns: Record<number, any> = {};

  columns.forEach((col) => {
    formattedColumns[col.id] = {
      id: col.id,
      name: col.name,
      labelIds: [col.gmailLabel],
      order: col.order,
      count: 0,
    };
  });

  return { columns: formattedColumns };
}
