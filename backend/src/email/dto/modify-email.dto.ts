import { IsArray, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ModifyEmailDto {
  @ApiPropertyOptional({
    description: 'List of label IDs to add',
    example: ['STARRED', 'IMPORTANT'],
  })
  @IsOptional()
  @IsArray()
  addLabelIds?: string[];

  @ApiPropertyOptional({
    description: 'List of label IDs to remove',
    example: ['UNREAD', 'INBOX'],
  })
  @IsOptional()
  @IsArray()
  removeLabelIds?: string[];
}
