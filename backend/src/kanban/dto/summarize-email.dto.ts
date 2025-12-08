import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsArray, IsString } from 'class-validator';

export class SummarizeEmailDto {
  @ApiPropertyOptional({
    description: 'Force regenerate summary even if exists',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  forceRegenerate?: boolean;
}

export class BatchSummarizeDto {
  @ApiProperty({
    description: 'Array of email IDs to summarize',
    example: ['18d8f2a3b4c5d6e7', '18d8f2a3b4c5d6e8'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  emailIds: string[];
}

export class SummarizeResponseDto {
  @ApiProperty({
    description: 'Email ID',
    example: '18d8f2a3b4c5d6e7',
  })
  emailId: string;

  @ApiProperty({
    description: 'Generated summary',
    example: 'Request to review Q4 report. Deadline: Friday.',
  })
  summary: string;

  @ApiProperty({
    description: 'Whether summary was from database',
    example: false,
  })
  fromDatabase: boolean;

  @ApiProperty({
    description: 'When summary was created/updated',
    example: '2025-12-08T01:30:00Z',
  })
  summarizedAt: string;
}

export class BatchSummarizeResponseDto {
  @ApiProperty({
    description: 'Number of successful summaries',
    example: 18,
  })
  success: number;

  @ApiProperty({
    description: 'Number of failed summaries',
    example: 2,
  })
  failed: number;

  @ApiProperty({
    description: 'Individual results',
    type: [Object],
  })
  results: Array<{
    emailId: string;
    success: boolean;
    summary?: string;
    error?: string;
  }>;
}

export class SummaryStatsDto {
  @ApiProperty({
    description: 'Total number of summaries generated',
    example: 142,
  })
  totalSummaries: number;

  @ApiProperty({
    description: 'Date of oldest summary',
    example: '2025-11-01T00:00:00Z',
    nullable: true,
  })
  oldestSummary: string | null;

  @ApiProperty({
    description: 'Date of newest summary',
    example: '2025-12-08T01:30:00Z',
    nullable: true,
  })
  newestSummary: string | null;
}
