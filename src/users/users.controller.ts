import { Controller, Post, Patch, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface AuthRequest extends ExpressRequest {
  user: { userId: string; email: string; name: string };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: AuthRequest) {
    const user = await this.usersService.findById(req.user.userId);
    return { name: user.name, Data: user.Data ?? [],email:user.email };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Body() body: { name?: string; email?: string }, @Request() req: AuthRequest) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/data')
  async getHealthData(@Request() req: AuthRequest) {
    return this.usersService.getHealthData(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-post')
  async createPost(@Body() body: any, @Request() req: AuthRequest) {
    return this.usersService.saveWithUser(body, req.user.userId);
  }
}
