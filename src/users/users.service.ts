import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Register
  async create(createUserDto: RegisterDto): Promise<User> {
    const { email, password, name } = createUserDto;

    // Check Email that already use?
    const existingUserEmail = await this.userModel.findOne({ email });
    if (existingUserEmail) {
      throw new ConflictException('Email already exists');
    }
    const existingUserName = await this.userModel.findOne({name});
    if(existingUserName){
      throw new ConflictException('Name already used');
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
 async findByIdGraph(id: string): Promise<User | null> {
    const data = this.userModel.findById(id).select('-password').exec();
    console.log(data);
    return data;
  }
  async findOneByName(name:string):Promise<User|null>{
    return this.userModel.findOne({name}).exec();
  }
  async saveWithUser(data: any, userId: string) {
    
    const result = await this.userModel.findByIdAndUpdate(
      userId,
      {$push :data},
      {returnDocument:'after'}
    );
    console.log(result)
    return result;
}
}