// Load environment variables first
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Alle API-routes under /api (klar til evt. api/admin og api/web senere)
  app.setGlobalPrefix('api');

  // Tillad CORS fra admin og andre dev-origins
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      /^http:\/\/localhost:\d+$/,
    ],
    credentials: true,
  });

  // Opsæt Swagger
  const config = new DocumentBuilder()
    .setTitle('Maanslogen API')
    .setDescription('API til Maanslogen admin og frontend')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    useGlobalPrefix: true, // Swagger UI og JSON under /api/swagger og /api/swagger-json
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
