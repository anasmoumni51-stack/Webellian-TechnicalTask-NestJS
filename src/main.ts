import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
            transformOptions: {                                                                                                                                                                                                                                                
        enableImplicitConversion: true,                                                                                                                                                                                                                                  
      },  
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(helmet());
  app.enableCors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' });

  //Swagger Integration
  const config = new DocumentBuilder()
    .setTitle('Webellian Technical Task Backend API')
    .setDescription(
      'REST API for managing shop catalogs, products, and their relationships deployed live on an Amazon AWS EC2 instance with HTTPS (FULL STRICT) on Cloudflare CDN + Rate Limiting 100req/10sec.\n\n' +
        'Created for the Webellian technical assessment,' +
        ' Each endpoint/DTO/Entity includes Swagger decorators so you can test them ' +
        'directly from this documentation.',
    )
    .setVersion('1.0')
    .addTag('Catalogs', 'Manage product catalogs')
    .addTag('Products', 'Manage products and assignments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
