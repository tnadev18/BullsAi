import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module'; // Assuming you have AuthModule from previous setup
import { HttpModule } from '@nestjs/axios'; // Ensure HttpModule is imported if needed globally or here
import { MarketdataModule } from './marketdata/marketdata.module'; // <-- Import MarketdataModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      cache: true,
    }),
    HttpModule, // Make HttpModule available globally or import it in specific modules like MarketdataModule
    AuthModule, // Existing AuthModule
    MarketdataModule, // <-- Add MarketdataModule here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}