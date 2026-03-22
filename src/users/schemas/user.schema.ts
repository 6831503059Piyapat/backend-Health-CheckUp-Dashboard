import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
interface FileProps {
  nameFile: String;
  provide:String;
  gender:String;
  age: Number;
  historical: String;
  height: Number;
  weight: Number;
  bmi: Number;
  vital_signs: {
    temperature: Number;
    heart_rate: Number;
    blood_pressure:String;
    respiratory_rate: Number;
    oxygen_saturation: Number;
    pulse:Number;
  };
  blood_test: {
    cbc: {
      wbc: Number;
      rbc: Number;
      hemoglobin: Number;
      hematocrit: Number;
      platelets: Number;
      mcv: Number;
    };
    fasting_blood_sugar: Number;
    hba1c:Number;
    lipid_profile: {
      total_cholesterol: Number;
      hdl: Number;
      ldl: Number;
      triglycerides: Number;
    };
    liver_function_test: {
      ast: Number;
      alt: Number;
      alp: Number;
      total_bilirubin: Number;
      albumin: Number;
      ggt: Number;
      direct_bilirubin: Number;
    };
    kidney_function_tes: {
      bun: Number;
      creatinine: Number;
      egfr: Number;
    };
    uric_acid: Number;
  };
  urinalysis: {
    color: String;
    clarity: String;
    specific_gravity: Number;
    ph: Number;
    protein: String;
    glucose: String;
    ketones: String;
    wbc: Number;
    rbc: Number;
  };
  stool_examination: {
    macroscopic:String;
    occult_blood: String;
  };
  chest_xray: {
    lung_opacity: String;
    heart: {
      ctr: String;
      cardiomegaly: String;
    }
  };
  electrocardiogram: {
    rhythm: String;
    heart_rate: Number;
    st_segment: String;
    t_wave:String;
  };
  ultrasound: {
    upper_abdomen: String;
    lower_abdomen: String;
  }
}
@Schema({ timestamps: true }) 
export class User extends Document {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop({type:Object})
  Data:FileProps;
}

export const UserSchema = SchemaFactory.createForClass(User);