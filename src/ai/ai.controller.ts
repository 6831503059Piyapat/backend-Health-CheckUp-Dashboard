import { Controller, Post, Body,UseInterceptors, UploadedFile } from '@nestjs/common';
import { AiService } from './ai.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File,
    @Body('prompt') prompt: string,) {
    return await this.aiService.handleFileUpload(file, prompt);

  }

  }
