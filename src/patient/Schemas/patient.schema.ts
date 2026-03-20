import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Patient extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  // collect ObjectId User to make Relation
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);