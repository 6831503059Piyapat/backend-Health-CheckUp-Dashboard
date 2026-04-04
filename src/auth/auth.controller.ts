import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
  
  @Post('check-register')
  async checkRegister(@Body() checkDto: any) {
    const user = await this.authService.validateUser(checkDto.email, checkDto.password);
    if (!user) {
      return { canRegister: true };
    }
 if(user){
    throw new UnauthorizedException('User already exists');
  }
  }

  @Post('register')
  async register(@Body() registerDto:any){
    const user = await this.authService.regis(registerDto);
    return{
    email:user.email
    }
  }
}