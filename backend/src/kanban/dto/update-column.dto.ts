import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsEnum } from 'class-validator';

export class UpdateColumnDto {
  @ApiProperty({ description: 'Column name', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @ApiProperty({
    description: 'Label assignment option - use "none" to remove label mapping',
    enum: ['existing', 'new', 'none'],
    required: false,
    example: 'none',
  })
  @IsOptional()
  @IsEnum(['existing', 'new', 'none'])
  labelOption?: 'existing' | 'new' | 'none';

  @ApiProperty({ description: 'Existing Gmail label ID', required: false })
  @IsOptional()
  @IsString()
  existingLabelId?: string;

  @ApiProperty({ description: 'Existing Gmail label name', required: false })
  @IsOptional()
  @IsString()
  existingLabelName?: string;

  @ApiProperty({ description: 'New Gmail label name', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  newLabelName?: string;
}
