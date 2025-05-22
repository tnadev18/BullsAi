import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
type UpstoxCandle = [string, number, number, number, number, number, number];
export declare class MarketdataService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    private readonly UPSTOX_API_VERSION;
    constructor(httpService: HttpService, configService: ConfigService);
    getHistoricalDataAndIndicators(instrumentKey: string, interval: string, toDate: string, fromDate: string): Promise<{
        ohlc: UpstoxCandle[];
        indicators: Record<string, any[]>;
    }>;
}
export {};
