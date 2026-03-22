import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  // get data user is that login
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    
    return this.usersService.findOneByEmail(req.user.email);
  }
  @UseGuards(JwtAuthGuard) 
  @Post('create-post')
async createPost(@Body() body: any, @Request() req) {
  const userId = req.user.userId; 
  console.log('User ID from Token:', req.user?.userId); // 1. ต้องมี ID
  console.log('Data from Frontend:', body); // 2. ต้องมีข้อมูลที่พิมพ์มา
  return this.usersService.saveWithUser(body, userId);
}

}