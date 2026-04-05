import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [ AiModule,ConfigModule.forRoot({ isGlobal: true,envFilePath: '.env' }),
    MongooseModule.forRootAsync({
    inject:[ConfigService],
    useFactory: async (config: ConfigService)=>({
      uri:config.get<string>('MONGODB_URL'),
    }),
  }), AuthModule, UsersModule, MailModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
