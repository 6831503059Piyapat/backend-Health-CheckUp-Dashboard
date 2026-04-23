import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
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
  private openai: OpenAI;
  private model: string;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY')!;
    this.model = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini';
    this.openai = new OpenAI({ apiKey });
  }

  async handleFileUpload(file: Express.Multer.File, userId: string, prompt?: string): Promise<any> {
    try {
      const finalPrompt = prompt
        ? `${EXTRACTION_PROMPT}\n\nAdditional context: ${prompt}`
        : EXTRACTION_PROMPT;

      const isImage = file.mimetype.startsWith('image/');

      let raw: string;
      if (isImage) {
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const completion = await this.openai.chat.completions.create({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: finalPrompt },
                { type: 'image_url', image_url: { url: dataUrl } },
              ],
            },
          ],
        });
        raw = completion.choices[0]?.message?.content ?? '';
      } else {
        const fileContent = file.buffer.toString('utf-8');
        const combined = `${finalPrompt}\n\nFile Content:\n${fileContent}`;
        const completion = await this.openai.chat.completions.create({
          model: this.model,
          messages: [{ role: 'user', content: combined }],
        });
        raw = completion.choices[0]?.message?.content ?? '';
      }

      const cleaned = this.cleanResponse(raw);
      const parsed = JSON.parse(cleaned);

      const record = {
        ...parsed,
        dateupload: new Date().toISOString().split('T')[0],
      };

      // await this.usersService.saveWithUser(record, userId);
      return record;
    } catch (error) {
      console.error('Error handling file upload:', error);
      throw new Error('Failed to process the uploaded file');
    }
  }

  async generateSuggest(prompt: string, ObjData: any): Promise<any> {
    try {
      const dataString = JSON.stringify(ObjData, null, 2);
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'user', content: `${prompt}\n\n${dataString}` },
        ],
      });
      const text = completion.choices[0]?.message?.content ?? '';
      return this.cleanResponse(text);
    } catch (error) {
      console.error('OpenAI suggest error:', error);
      throw new Error('Failed to generate suggestion');
    }
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
      });
      let text = completion.choices[0]?.message?.content ?? '';
      if (text.includes('```')) {
        text = text.replace(/```json|```/g, '').trim();
      }
      return text;
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new Error('Failed to generate content from OpenAI');
    }
  }

  async predictTrend(prompt: string): Promise<any> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
      });
      const raw = completion.choices[0]?.message?.content ?? '';
      const text = this.cleanResponse(raw);
      return JSON.parse(text);
    } catch (error) {
      console.error('Predict trend error:', error);
      throw new Error('Failed to generate health prediction');
    }
  }

  private cleanResponse(text: string): string {
    if (text.includes('```')) {
      return text.replace(/```json|```/g, '').trim();
    }
    return text.trim();
  }
}
