import { Controller, Post, Patch, Body, Get,Delete, UseGuards, Request,Param } from '@nestjs/common';
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
  @Delete('delete-calendar')
  async remove(@Body() body:any,@Request() req :AuthRequest) {
    return await this.usersService.delete(body.eventId,req.user.userId);
  }

   @UseGuards(JwtAuthGuard)
  @Get('me/Calendar')
  async getCalendar(@Request() req: AuthRequest) {
    return this.usersService.getCalendar(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-post')
  async createPost(@Body() body: any, @Request() req: AuthRequest) {
    return this.usersService.saveWithUser(body, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)  
  @Post('create-calendar')
  
  async createCalendar(@Body() body:{_id:string,title:string,time:string,date:string},@Request() req:AuthRequest){
    return this.usersService.saveCalendarWithUser({_id:body._id,title:body.title,time:body.time,date:body.date,userId:req.user.userId},req.user.userId);
  }
}
