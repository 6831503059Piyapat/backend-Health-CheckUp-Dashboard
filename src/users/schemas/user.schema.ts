import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface HealthRecord {
  dateFile: string;
  dateupload: string;
  provide: string;
  fullName: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
  bmi: number;
  fbs: number;
  cholesterol: number;
  hdl: number;
  ldl: number;
  bloodPressure: string;
  triglycerides: number;
  creatinine: number;
  sgpt: number;
  hemoglobin: number;
  wbc: number;
  platelets: number;
  spo2: number;
  heartRate: number;
  suggestion: string;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verificationCode: string;

  @Prop()
  verificationCodeExpiry: Date;

  @Prop({ type: [Object], default: [] })
  Data: HealthRecord[];
}

export const UserSchema = SchemaFactory.createForClass(User);
