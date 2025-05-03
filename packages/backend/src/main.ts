// packages/backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { Logger } from '@nestjs/common'; // Import Logger

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // Get instance
  const logger = new Logger('Bootstrap');

  const port = configService.get<number>('PORT', 5000); // Default to 5000 if not set
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  // Enable CORS for the frontend development server
  app.enableCors({
    origin: frontendUrl || 'http://localhost:3000', // Allow frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Set a global prefix for all routes (e.g., /api/status)
  app.setGlobalPrefix('api');

  await app.listen(port);
  logger.log(`🚀 Application is running in [${nodeEnv}] mode on: http://localhost:${port}/api`);
  logger.log(`🔌 CORS enabled for origin: ${frontendUrl || 'http://localhost:3000'}`);

}
bootstrap();