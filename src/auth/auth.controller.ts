import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.regis(registerDto);
    return { email: user.email };
  }

  @Post('login')  
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUserLogin(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
      
    }
    return this.authService.login(user);
  }
  
  @Post('check-register')
  async checkRegister(@Body() checkDto: any) {
    const user = await this.authService.validateUserRegister(
      checkDto.email, checkDto.password,checkDto.name);
    if(user && !user.isVerified){
      return { canRegister:true}; 
     }
    if (!user) {
      return { canRegister: true };
    }

 if(user){
    throw new UnauthorizedException('User already exists');
  }
   }

  @Post('verify')
  async verify(@Body() body: { email: string; code: string }) {
    return this.authService.verifyEmail(body.email, body.code);
  }

  @Post('resend-code')
  async resendCode(@Body() body: { email: string}) {
    return this.authService.resendCode(body.email);
  }
}
