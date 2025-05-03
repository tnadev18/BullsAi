import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios'; // Ensure HttpModule is available

@Module({
  imports: [HttpModule], // Make HttpService available within this module
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}