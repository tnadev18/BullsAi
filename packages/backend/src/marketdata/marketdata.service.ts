import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { SMA, EMA, RSI, MACD, BollingerBands } from 'technicalindicators';

type UpstoxCandle = [string, number, number, number, number, number, number];

@Injectable()
export class MarketdataService {
  private readonly logger = new Logger(MarketdataService.name);
  private readonly UPSTOX_API_VERSION = 'v2';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getHistoricalDataAndIndicators(
    instrumentKey: string,
    interval: string,
    toDate: string,
    fromDate: string,
  ): Promise<{ ohlc: UpstoxCandle[]; indicators: Record<string, any[]> }> {
    const accessToken = this.configService.getOrThrow<string>('UPSTOX_ACCESS_TOKEN');
    const apiEndpoint = this.configService.getOrThrow<string>('UPSTOX_API_ENDPOINT');
    const encodedInstrumentKey = encodeURIComponent(instrumentKey);
    const url = `${apiEndpoint}/historical-candle/${encodedInstrumentKey}/${interval}/${toDate}/${fromDate}`;

    this.logger.debug(`Fetching historical data from: ${url}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`Upstox API Error: ${error.response?.status} - Data: ${JSON.stringify(error.response?.data)}`, error.stack);
            // --- FIX STARTS HERE ---
            // Safely extract error message
            let detailMessage = error.message; // Default to Axios error message
            if (error.response?.data) {
                // Attempt to get a more specific message from response data if it exists
                // Adjust '.message' or other properties based on actual Upstox error structure
                const responseData = error.response.data as any; // Cast to any for dynamic access
                detailMessage = responseData.message || responseData.error || JSON.stringify(responseData);
            }
            throw new HttpException(
              `Failed to fetch data from Upstox: ${detailMessage}`,
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
            // --- FIX ENDS HERE ---
          }),
        ),
      );

      // ... (rest of the successful response handling logic remains the same)
       if (response.data?.status !== 'success' || !response.data?.data?.candles) {
         this.logger.warn(`Upstox response indicates failure or missing data: ${JSON.stringify(response.data)}`);
         throw new HttpException('Received invalid data structure from Upstox', HttpStatus.BAD_GATEWAY);
       }

       const candles: UpstoxCandle[] = response.data.data.candles;
       this.logger.log(`Received ${candles.length} candles for ${instrumentKey}`);

       if (candles.length === 0) {
         return { ohlc: [], indicators: {} };
       }

       const closePrices = candles.map(candle => candle[4]);

       const indicators = {
         sma10: SMA.calculate({ period: 10, values: closePrices }),
         ema10: EMA.calculate({ period: 10, values: closePrices }),
         rsi14: RSI.calculate({ period: 14, values: closePrices }),
         macd: MACD.calculate({
           values: closePrices,
           fastPeriod: 12,
           slowPeriod: 26,
           signalPeriod: 9,
           SimpleMAOscillator: false,
           SimpleMASignal: false,
         }),
         bollingerBands: BollingerBands.calculate({
           period: 20,
           values: closePrices,
           stdDev: 2,
         }),
       };

       return { ohlc: candles, indicators };

    } catch (error) {
       if (error instanceof HttpException) {
          throw error;
       }
       this.logger.error(`Unexpected error in getHistoricalDataAndIndicators: ${error.message}`, error.stack);
       throw new HttpException('An internal server error occurred while processing market data', HttpStatus.INTERNAL_SERVER_ERROR);
     }
  }
}