import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  const configService = app.get(ConfigService);
  const port = process.env.PORT || 3000;
  // const port = configService.get<number>('PORT')||3000;

  await app.listen(port,'0.0.0.0');
}
bootstrap();
