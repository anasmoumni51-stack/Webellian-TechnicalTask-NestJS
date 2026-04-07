import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(helmet());
  app.enableCors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' });

  //Swagger Integration
  const config = new DocumentBuilder()
    .setTitle('Webellian Technical Task Backend API')
    .setDescription('API documentation for the Catalogs & Products assignment')
    .setVersion('1.0')
    .addTag('Catalogs', 'Manage product catalogs')
    .addTag('Products', 'Manage products and assignments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
