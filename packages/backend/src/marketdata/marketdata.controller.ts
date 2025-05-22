import { Controller, Get, Query, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MarketdataService } from './marketdata.service';

@Controller('marketdata') // Route prefix: /api/marketdata
export class MarketdataController { // --->>> Ensure class name matches import <<<---
  private readonly logger = new Logger(MarketdataController.name);

  constructor(private readonly marketdataService: MarketdataService) {}

  @Get('historical') // GET /api/marketdata/historical
  async getHistoricalData(
    @Query('symbol') symbol: string,
    @Query('interval') interval: string,
    @Query('to') toDate: string,
    @Query('from') fromDate: string,
  ) {
    if (!symbol || !interval || !toDate || !fromDate) {
      throw new HttpException('Missing required query parameters: symbol, interval, to, from', HttpStatus.BAD_REQUEST);
    }

    this.logger.log(`Received request for historical data: ${symbol}, Interval: ${interval}, From: ${fromDate}, To: ${toDate}`);

    try {
      const data = await this.marketdataService.getHistoricalDataAndIndicators(
        symbol,
        interval,
        toDate,
        fromDate,
      );
      return data;
    } catch (error) {
       this.logger.error(`Error fetching historical data for ${symbol}: ${error.message}`, error.stack);
       if (error instanceof HttpException) {
           throw error;
       }
       throw new HttpException('Failed to retrieve historical market data.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}