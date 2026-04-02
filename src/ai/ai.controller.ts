import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body('prompt') prompt?: string,
  ) {
    if (!file) throw new BadRequestException('file is required');
    return this.aiService.handleFileUpload(file, req.user.userId, prompt);
  }

  @Post('suggest')
  async generateSuggest(
    @Body('promptData') prompt: string,
    @Body('ObjData') data: any,
  ) {
    if (!prompt) throw new BadRequestException('promptData is required');
    if (!data) throw new BadRequestException('ObjData is required');
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    return this.aiService.generateSuggest(prompt, parsedData);
  }
}
