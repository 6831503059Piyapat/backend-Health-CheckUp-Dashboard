import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. ตรวจสอบ User & Password
  async validateUser(email: string, pass: string): Promise<any> {
    const userByEmail = await this.usersService.findOneByEmail(email);
    const userByname = await this.usersService.findOneByName(email);
    
    if (userByEmail && (await bcrypt.compare(pass, userByEmail.password))) {
      const { password, ...result } = userByEmail.toObject();
      return result;
    }
    else if (userByname && (await bcrypt.compare(pass, userByname.password))) {
      const { password, ...result } = userByname.toObject();
      return result;
    }
    return null;
  }

  // 2. สร้าง Token หลังจาก Login ผ่าน
  async login(user: any) {
    const payload = { email: user.email, sub: user._id, name:user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async regis(user:RegisterDto){
    const SaveRegis = await this.usersService.create({
      name:user.name||"",
      email:user.email||"",
      password:user.password
    });
    return SaveRegis;

  }
}