import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type CalendarDocument = HydratedDocument<Calendar>;
@Schema()
export class Calendar {
  @Prop({ type: String }) 
  _id: string;

  @Prop()
  title: string;

  @Prop()
  date:string;

  @Prop()
  userId: string;
}
export const CalendarSchema = SchemaFactory.createForClass(Calendar);
