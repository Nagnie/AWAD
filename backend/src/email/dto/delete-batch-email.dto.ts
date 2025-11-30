import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeleteBatchEmailDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true, message: 'Email ID should not be empty' })
  @ApiProperty({ type: [String] })
  ids: string[];
}
