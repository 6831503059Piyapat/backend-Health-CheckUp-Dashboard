import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './Schemas/patient.schema';

@Injectable()
export class PatientService {
  constructor(@InjectModel(Patient.name) private contentModel: Model<Patient>) {}

  // สร้างข้อมูลใหม่โดยผูกกับ userId
  async create(createDto: any, userId: string): Promise<Patient> {
    const newContent = new this.contentModel({
      ...createDto,
      authorId: userId, // ผูก ID เจ้าของที่นี่
    });
    return newContent.save();
  }

  // ดึงเฉพาะข้อมูลที่ authorId ตรงกับ userId ของผู้ใช้ที่ล็อกอิน
  async findAllByUserId(userId: string): Promise<Patient[]> {
    return this.contentModel.find({ authorId: userId }).sort({ createdAt: -1 }).exec();
  }

  // ลบข้อมูล (ต้องเช็คเจ้าของด้วยเพื่อความปลอดภัย)
  async remove(id: string, userId: string) {
    return this.contentModel.findOneAndDelete({ _id: id, authorId: userId }).exec();
  }
}