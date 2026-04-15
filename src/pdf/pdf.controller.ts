import {
  Controller,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post()
  async createPdf(
    @Body() body: any,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.pdfService.generatePdf(body);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=report.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }
}
