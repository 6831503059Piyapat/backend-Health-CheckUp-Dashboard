import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  // 1. ตรวจสอบ User & Password
  async validateUserLogin(email: string, pass: string): Promise<any> {
    const userByEmail = await this.usersService.findOneByEmail(email);
    const userByname = await this.usersService.findOneByName(email);

    let user: any = null;
    if (userByEmail && (await bcrypt.compare(pass, userByEmail.password))) {
      const { password, ...result } = userByEmail.toObject();
      user = result;
    } else if (userByname && (await bcrypt.compare(pass, userByname.password))) {
      const { password, ...result } = userByname.toObject();
      user = result;
    }

    if (!user) return null;
    if(!user.isVerified) throw new UnauthorizedException('Email not verified');
      return user;
  }
  
   async validateUserRegister(email: string, pass: string): Promise<any> {
    const userByEmail = await this.usersService.findOneByEmail(email);
    const userByname = await this.usersService.findOneByName(email);

    let user: any = null;
    if (userByEmail && (await bcrypt.compare(pass, userByEmail.password))) {
      const { password, ...result } = userByEmail.toObject();
      user = result;
    } else if (userByname && (await bcrypt.compare(pass, userByname.password))) {
      const { password, ...result } = userByname.toObject();
      user = result;
    }
    if(user.isVerified) throw new UnauthorizedException('Email not verified');

    if (!user) return null;
      return user;
  }
  

  // 2. สร้าง Token หลังจาก Login ผ่าน
  async login(user: any) {
    const payload = { email: user.email, sub: user._id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async regis(user: RegisterDto) {
    const SaveRegis = await this.usersService.create({
      name: user.name || '',
      email: user.email || '',
      password: user.password || '' ,
    });
  const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
    const code = generateRandomString(6);
    await this.usersService.saveVerificationCode(String(SaveRegis._id), code);
    await this.mailService.sendVerificationEmail(SaveRegis.email, SaveRegis.name, code);
    return SaveRegis;
  }

  async verifyEmail(email: string, code: string) {
    const ok = await this.usersService.verifyCode(email, code);
    if (!ok) throw new BadRequestException('Invalid or expired verification code');
    return { message: 'Email verified successfully' };
  }

  async resendCode(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('No account found with that email');
    if (user.isVerified) throw new BadRequestException('Email is already verified');
   const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
    const code = generateRandomString(6);
    await this.usersService.saveVerificationCode(String(user._id), code);
    await this.mailService.sendVerificationEmail(user.email, user.name, code);
    return { message: 'Verification code resent' };
  }
}
