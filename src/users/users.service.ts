import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Register
  async create(createUserDto: any): Promise<User> {
    const { email, password, name } = createUserDto;

    // Check Email that already use?
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
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
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').exec();
  }
}