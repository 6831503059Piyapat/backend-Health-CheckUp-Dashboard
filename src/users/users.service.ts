import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import {Calendar,CalendarDocument} from './schemas/calendar.schema'
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class UsersService {
  constructor(
  @InjectModel(User.name) private userModel: Model<User>,
  @InjectModel(Calendar.name) private calendarModel:Model<CalendarDocument>) {}

  // Register
  async create(createUserDto: RegisterDto): Promise<User> {
    const { email, password, name } = createUserDto;

    // Check Email that already use?
    const existingUserEmail = await this.userModel.findOne({ email });
    if (existingUserEmail) {
      // If email exists, replace/update the existing user with new data.
      if (name) {
        const existingUserName = await this.userModel.findOne({ name });
        if (existingUserName && existingUserName._id.toString() !== existingUserEmail._id.toString()) {
          throw new ConflictException('Name already used');
        }
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      if (typeof name === 'string') existingUserEmail.name = name;
      existingUserEmail.password = hashedPassword;
      return existingUserEmail.save();
    }

    if (name) {
      const existingUserName = await this.userModel.findOne({ name });
      if (existingUserName) {
        throw new ConflictException('Name already used');
      }
    }

    // Hash password before save (Salt 10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      name,
    });

    return newUser.save();
  }

  // For AuthService call Login
  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // for pull Profile  (not send password back)
  async findById(id: string): Promise<any> {
    return this.userModel.findById(id).select('-password -verificationCode -verificationCodeExpiry').lean().exec();
  }
 async findByIdGraph(id: string): Promise<User | null> {
    const data = this.userModel.findById(id).select('-password').exec();
    return data;
  }
  async findOneByName(name:string):Promise<User|null>{
    return this.userModel.findOne({name}).exec();
  }
  async getHealthData(userId: string) {
    const user = await this.userModel.findById(userId).select('Data').lean().exec();
    return user?.Data ?? null;
  }

  async getCalendar(userId:string){
    const user = await this.userModel.findById(userId).select('Calendar').lean().exec();
    return user?.Calendar ?? null;
  }

  async saveWithUser(data: any, userId: string) {
    return await this.userModel.findByIdAndUpdate(
    userId,
    { 
      $push: { Data: data }
    },
    { new: true }
  ).lean().exec();
  }
  async saveCalendarWithUser(data: any, userId: string) {
    return await this.userModel.findByIdAndUpdate(
    userId,
    { 
      $push: { Calendar: data }
    },
    { new: true }
  ).lean().exec();
  }

  async saveVerificationCode(userId: string, code: string) {
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.userModel.findByIdAndUpdate(userId, {
      verificationCode: code,
      verificationCodeExpiry: expiry,
    });
  }

async delete(eventId:string, userId: string): Promise<any> {
  
    const result = await this.userModel.findOneAndUpdate(
    { _id: userId }, 
    { 
      $pull: { 
        Calendar: { _id: eventId } 
      } 
    },
    { new: true } 
  ).exec();
    if (!result) {
      throw new ConflictException(`Event with ID not found`);
    }

    return { message: 'Deleted successfully' };
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (!user || user.verificationCode !== code) return false;
    if (!user.verificationCodeExpiry || user.verificationCodeExpiry < new Date()) return false;

    await this.userModel.findByIdAndUpdate(user._id, {
      isVerified: true,
      $unset: { verificationCode: '', verificationCodeExpiry: '' },
    });
    return true;
  }

  async updateProfile(userId: string, updates: { name?: string; email?: string }) {
    if (updates.email) {
      const existing = await this.userModel.findOne({ email: updates.email });
      if (existing && existing._id.toString() !== userId) {
        throw new ConflictException('Email already in use');
      }
    }
    if (updates.name) {
      const existing = await this.userModel.findOne({ name: updates.name });
      if (existing && existing._id.toString() !== userId) {
        throw new ConflictException('Name already in use');
      }
    }
    return this.userModel
      .findByIdAndUpdate(userId, { $set: updates }, { returnDocument: 'after' })
      .select('-password')
      .exec();
  }
}