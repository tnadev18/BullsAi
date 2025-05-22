import { Module } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';
// --->>> Make sure this line matches the filename exactly (without .ts) <<<---
import { MarketdataController } from './marketdata.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule
  ],
  // --->>> Make sure the class name used here matches the imported class <<<---
  controllers: [MarketdataController],
  providers: [MarketdataService],
})
export class MarketdataModule {}