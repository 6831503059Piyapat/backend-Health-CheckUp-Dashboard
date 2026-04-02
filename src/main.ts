import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService);
  const port = process.env.PORT || 9000;
  // const port = configService.get<number>('PORT')||9000;

  await app.listen(port,'0.0.0.0');
}
bootstrap();
