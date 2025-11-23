import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller()
export class UploadsController {
  @Get('uploads/avatars/:filename')
  async getAvatar(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', 'avatars', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Avatar not found');
    }

    res.setHeader(
      'Access-Control-Allow-Origin',
      process.env.FRONTEND_URL || 'http://localhost:3000',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Determine content type based on file extension
    const ext = filename.split('.').pop()?.toLowerCase();
    const contentType =
      ext === 'jpg' || ext === 'jpeg'
        ? 'image/jpeg'
        : ext === 'png'
          ? 'image/png'
          : ext === 'gif'
            ? 'image/gif'
            : 'image/png';

    res.setHeader('Content-Type', contentType);

    return res.sendFile(filePath);
  }
}
