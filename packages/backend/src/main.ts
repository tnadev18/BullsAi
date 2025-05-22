import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common'; // Added Logger and ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = configService.get<number>('PORT', 5000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  // Enable CORS
  app.enableCors({
    origin: frontendUrl || '*', // Adjust origin as needed for security
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Set Global API Prefix
  app.setGlobalPrefix('api'); // <-- Added this line

  // Add Global Validation Pipe (recommended for DTOs later)
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(port);
  logger.log(`🚀 Application is running in [${nodeEnv}] mode on: http://localhost:${port}/api`);
  if (frontendUrl) {
    logger.log(`🔌 CORS enabled for origin: ${frontendUrl}`);
  } else {
    logger.warn(`🔌 CORS enabled for '*' - Consider restricting in production.`);
  }
}
bootstrap();