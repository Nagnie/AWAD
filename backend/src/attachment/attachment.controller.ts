import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AtGuard } from '../auth/guards/at.guard';
import { ApiOperation, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('attachments')
@UseGuards(AtGuard)
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Get(':attachmentId')
  @ApiSecurity('jwt')
  @ApiOperation({
    summary: 'Download email attachment',
    description: 'Stream attachment file to client',
  })
  @ApiQuery({
    name: 'messageId',
    required: true,
    description: 'The message ID that contains the attachment',
  })
  async downloadAttachment(
    @Req() req,
    @Param('attachmentId') attachmentId: string,
    @Query('messageId') messageId: string,
    @Query('filename') filename: string,
    @Query('mimeType') mimeType: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    if (!messageId) {
      throw new BadRequestException('messageId query parameter is required');
    }

    if (!filename) {
      throw new BadRequestException('filename query parameter is required');
    }

    if (!mimeType) {
      throw new BadRequestException('mimeType query parameter is required');
    }

    const { buffer, size } = await this.attachmentService.getAttachment(
      req.user.sub,
      messageId,
      attachmentId,
    );

    // Decode filename từ URL encoding
    const decodedFilename = decodeURIComponent(filename);

    // Set response headers với RFC 5987 encoding cho unicode filenames
    const contentDisposition = /[^\x20-\x7E]/.test(decodedFilename)
      ? `attachment; filename*=UTF-8''${encodeURIComponent(decodedFilename)}; filename="${decodedFilename}"`
      : `attachment; filename="${decodedFilename}"`;

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': contentDisposition,
      'Content-Length': size.toString(),
    });

    return new StreamableFile(buffer);
  }
}
