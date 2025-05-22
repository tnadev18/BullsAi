import { MarketdataService } from './marketdata.service';
export declare class MarketdataController {
    private readonly marketdataService;
    private readonly logger;
    constructor(marketdataService: MarketdataService);
    getHistoricalData(symbol: string, interval: string, toDate: string, fromDate: string): Promise<{
        ohlc: [string, number, number, number, number, number, number][];
        indicators: Record<string, any[]>;
    }>;
}
