// packages/backend/src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Base path '/' relative to global prefix '/api'
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET /api/status
  @Get('status')
  getStatus(): { ok: boolean; timestamp: string } {
    return { ok: true, timestamp: new Date().toISOString() };
  }

  // Optional: Keep or remove the default hello world endpoint
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}