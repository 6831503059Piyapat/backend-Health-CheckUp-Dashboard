import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './patient/patient.module';
import { AiModule } from './ai/ai.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [PatientModule, AiModule,ConfigModule.forRoot({ isGlobal: true,envFilePath: '.env' }),
    MongooseModule.forRootAsync({
    inject:[ConfigService],
    useFactory: async (config: ConfigService)=>({
      uri:config.get<string>('MONGODB_URL'),
    }),
  }),PatientModule, AuthModule, UsersModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
