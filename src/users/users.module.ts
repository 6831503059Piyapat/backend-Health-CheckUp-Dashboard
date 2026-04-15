import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import {Calendar,CalendarSchema} from './schemas/calendar.schema';

@Module({
  imports: [
    // Connect Schema with Collection in MongoDB
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{name:Calendar.name,schema:CalendarSchema}]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}