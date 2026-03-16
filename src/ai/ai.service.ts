import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';


@Injectable()
export class AiService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
   const apiKey = this.configService.get<string>('GEMINI_API_KEY')!; 
this.genAI = new GoogleGenerativeAI(apiKey);
    // เลือกโมเดลที่ต้องการ เช่น gemini-1.5-flash หรือ gemini-1.5-pro
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
async handleFileUpload(file: Express.Multer.File, prompt: string): Promise<string> {
  try {
    // ตรวจสอบว่าเป็นไฟล์รูปภาพหรือไม่
    const isImage = file.mimetype.startsWith('image/');

    if (isImage) {
      // ถ้าเป็นรูปภาพ ต้องส่งแบบ Multi-part (Prompt + Image Data)
      const imagePart = {
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype,
        },
      };
      
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return this.cleanResponse(response.text());
    } else {
      // ถ้าเป็นไฟล์ text ปกติ (csv, txt, etc.) ใช้วิธีเดิมได้
      const fileContent = file.buffer.toString('utf-8');
      const combinedPrompt = `${prompt}\n\nFile Content:\n${fileContent}`;
      return await this.generateText(combinedPrompt);
    }
  } catch (error) {
    console.error('Error handling file upload:', error);
    throw new Error('Failed to process the uploaded file');
  }
}

// แยก logic การ clean code blocks ออกมาเพื่อให้ใช้ซ้ำได้
private cleanResponse(text: string): string {
  if (text.includes('```')) {
    return text.replace(/```json|```/g, '').trim();
  }
  return text;
}
  async generateText(prompt: string): Promise<string> {
  try {
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Remove markdown code blocks if they exist
    if (text.includes('```')) {
      text = text.replace(/```json|```/g, '').trim();
    }

    return text;
  } catch (error) {
    console.error('Gemini Error:', error);
    throw new Error('Failed to generate content from Gemini');
  }
}
}