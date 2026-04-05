import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('STK - Technical Test Fullstack Web')
    .setDescription('Documentation for the STK technical test backend API from Muhammad Insan Kamil')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
