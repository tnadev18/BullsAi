"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MarketdataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketdataService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const technicalindicators_1 = require("technicalindicators");
let MarketdataService = MarketdataService_1 = class MarketdataService {
    httpService;
    configService;
    logger = new common_1.Logger(MarketdataService_1.name);
    UPSTOX_API_VERSION = 'v2';
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    async getHistoricalDataAndIndicators(instrumentKey, interval, toDate, fromDate) {
        const accessToken = this.configService.getOrThrow('UPSTOX_ACCESS_TOKEN');
        const apiEndpoint = this.configService.getOrThrow('UPSTOX_API_ENDPOINT');
        const encodedInstrumentKey = encodeURIComponent(instrumentKey);
        const url = `${apiEndpoint}/historical-candle/${encodedInstrumentKey}/${interval}/${toDate}/${fromDate}`;
        this.logger.debug(`Fetching historical data from: ${url}`);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                },
            }).pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error(`Upstox API Error: ${error.response?.status} - Data: ${JSON.stringify(error.response?.data)}`, error.stack);
                let detailMessage = error.message;
                if (error.response?.data) {
                    const responseData = error.response.data;
                    detailMessage = responseData.message || responseData.error || JSON.stringify(responseData);
                }
                throw new common_1.HttpException(`Failed to fetch data from Upstox: ${detailMessage}`, error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            if (response.data?.status !== 'success' || !response.data?.data?.candles) {
                this.logger.warn(`Upstox response indicates failure or missing data: ${JSON.stringify(response.data)}`);
                throw new common_1.HttpException('Received invalid data structure from Upstox', common_1.HttpStatus.BAD_GATEWAY);
            }
            const candles = response.data.data.candles;
            this.logger.log(`Received ${candles.length} candles for ${instrumentKey}`);
            if (candles.length === 0) {
                return { ohlc: [], indicators: {} };
            }
            const closePrices = candles.map(candle => candle[4]);
            const indicators = {
                sma10: technicalindicators_1.SMA.calculate({ period: 10, values: closePrices }),
                ema10: technicalindicators_1.EMA.calculate({ period: 10, values: closePrices }),
                rsi14: technicalindicators_1.RSI.calculate({ period: 14, values: closePrices }),
                macd: technicalindicators_1.MACD.calculate({
                    values: closePrices,
                    fastPeriod: 12,
                    slowPeriod: 26,
                    signalPeriod: 9,
                    SimpleMAOscillator: false,
                    SimpleMASignal: false,
                }),
                bollingerBands: technicalindicators_1.BollingerBands.calculate({
                    period: 20,
                    values: closePrices,
                    stdDev: 2,
                }),
            };
            return { ohlc: candles, indicators };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Unexpected error in getHistoricalDataAndIndicators: ${error.message}`, error.stack);
            throw new common_1.HttpException('An internal server error occurred while processing market data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.MarketdataService = MarketdataService;
exports.MarketdataService = MarketdataService = MarketdataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], MarketdataService);
//# sourceMappingURL=marketdata.service.js.map