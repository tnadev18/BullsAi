// packages/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module'; // Import AuthModule
import { HttpModule } from '@nestjs/axios'; // Import HttpModule globally if needed often
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigService available globally
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Load .env.development or .env.production etc.
      cache: true, // Improve performance by caching variables
    }),
    AuthModule, // Add AuthModule here
    HttpModule, // Make HttpModule available (used by AuthService)
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}