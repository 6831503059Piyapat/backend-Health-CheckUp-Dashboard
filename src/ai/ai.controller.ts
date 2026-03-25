import { Controller, Post, Body,UseInterceptors, UploadedFile } from '@nestjs/common';
import { AiService } from './ai.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File,
    @Body('prompt') prompt: string,) {
    return await this.aiService.handleFileUpload(file, prompt);

  }
 @Post('suggest')
async generateSuggest(@Body('promptData') prompt: string, @Body('ObjData') data: any) {
  return this.aiService.generateSuggest(prompt, data);
}

  }
