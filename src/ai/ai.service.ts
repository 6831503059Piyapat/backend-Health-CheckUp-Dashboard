import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { UsersService } from '../users/users.service';

const EXTRACTION_PROMPT = `
You are a medical data extraction assistant.
Extract health checkup data from the provided document or image and return a single raw JSON object with exactly this structure.
Use null for any field not found in the document. Do NOT guess or invent values.
Return ONLY the raw JSON — no markdown, no code blocks, no explanation.

{
  "dateFile": "string — date of the report (YYYY-MM-DD)",
  "provide": "string — hospital, clinic, or doctor name",
  "fullName": "string — patient full name",
  "age": number,
  "height": number,
  "weight": number,
  "gender": "string — Male or Female",
  "bmi": number,
  "fbs": number,
  "cholesterol": number,
  "hdl": number,
  "ldl": number,
  "bloodPressure": "string — e.g. 120/80",
  "triglycerides": number,
  "creatinine": number,
  "sgpt": number,
  "hemoglobin": number,
  "wbc": number,
  "platelets": number,
  "spo2": number,
  "heartRate": number
}
`;

@Injectable()
export class AiService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')!;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async handleFileUpload(file: Express.Multer.File, userId: string, prompt?: string): Promise<any> {
    try {
      const finalPrompt = prompt
        ? `${EXTRACTION_PROMPT}\n\nAdditional context: ${prompt}`
        : EXTRACTION_PROMPT;

      const isImage = file.mimetype.startsWith('image/');

      let raw: string;
      if (isImage) {
        const imagePart = {
          inlineData: {
            data: file.buffer.toString('base64'),
            mimeType: file.mimetype,
          },
        };
        const result = await this.model.generateContent([finalPrompt, imagePart]);
        raw = result.response.text();
      } else {
        const fileContent = file.buffer.toString('utf-8');
        const combined = `${finalPrompt}\n\nFile Content:\n${fileContent}`;
        const result = await this.model.generateContent(combined);
        raw = result.response.text();
      }

      const cleaned = this.cleanResponse(raw);
      const parsed = JSON.parse(cleaned);

      const record = {
        ...parsed,
        dateupload: new Date().toISOString().split('T')[0],
      };

      await this.usersService.saveWithUser(record, userId);
      return record;
    } catch (error) {
      console.error('Error handling file upload:', error);
      throw new Error('Failed to process the uploaded file');
    }
  }

  async generateSuggest(prompt: string, ObjData: any): Promise<any> {
    try {
      const dataString = JSON.stringify(ObjData, null, 2);
      const result = await this.model.generateContent([prompt, dataString]);
      const response = await result.response;
      return this.cleanResponse(response.text());
    } catch (error) {
      console.error('Gemini suggest error:', error);
      throw new Error('Failed to generate suggestion');
    }
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      if (text.includes('```')) {
        text = text.replace(/```json|```/g, '').trim();
      }
      return text;
    } catch (error) {
      console.error('Gemini Error:', error);
      throw new Error('Failed to generate content from Gemini');
    }
  }

  private cleanResponse(text: string): string {
    if (text.includes('```')) {
      return text.replace(/```json|```/g, '').trim();
    }
    return text.trim();
  }
}
