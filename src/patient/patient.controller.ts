import { Controller, Get, Post, Body, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { PatientService } from './patient.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('patient')
@UseGuards(JwtAuthGuard) // ป้องกันทั้ง Controller: ต้อง Login เท่านั้นถึงจะเข้าถึงได้
export class PatientController {
  constructor(private readonly contentsService: PatientService) {}

  @Post()
  async create(@Request() req, @Body() createDto: any) {
    // req.user.userId มาจาก JwtStrategy.validate()
    return this.contentsService.create(createDto, req.user.userId);
  }

  @Get()
  async getMyContents(@Request() req) {
    // ดึงเฉพาะข้อมูลที่ "แอ็คเค้า นั้นๆ มี"
    return this.contentsService.findAllByUserId(req.user.userId);
  }

  @Delete(':id')
  async deleteContent(@Param('id') id: string, @Request() req) {
    return this.contentsService.remove(id, req.user.userId);
  }
}