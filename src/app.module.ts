import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, PatientModule, AiModule,ConfigModule.forRoot({ isGlobal: true,envFilePath: '.env' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
