// Load environment variables first
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Alle API-routes under /api (klar til evt. api/admin og api/web senere)
  app.setGlobalPrefix('api');

  // Tillad CORS fra admin og andre dev-origins (localhost + Pi/netværk + offentlig admin)
  const corsOrigins: (string | RegExp)[] = [
    'http://localhost:9091',
    'http://localhost:9090',
    /^http:\/\/localhost:\d+$/,
    /^http:\/\/192\.168\.\d+\.\d+:\d+$/, // Pi og andre på lokalt netværk
    /^https:\/\/maanslogen-admin\.mathiasfoldager\.com$/,
    /^https:\/\/[a-z0-9-]+\.mathiasfoldager\.com$/, // evt. andre subdomains
  ];
  if (process.env.CORS_ORIGINS) {
    corsOrigins.push(
      ...process.env.CORS_ORIGINS.split(',').map((s) => s.trim()),
    );
  }
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Tillad Private Network Access: når admin kører på https (offentlig) og kalder API på privat IP (192.168.x.x)
  app.use(
    (
      _req: { method: string },
      res: {
        setHeader: (name: string, value: string) => void;
        end?: () => void;
      },
      next: () => void,
    ) => {
      res.setHeader('Access-Control-Allow-Private-Network', 'true');
      next();
    },
  );

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

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 9090;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
