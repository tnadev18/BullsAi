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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MarketdataController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketdataController = void 0;
const common_1 = require("@nestjs/common");
const marketdata_service_1 = require("./marketdata.service");
let MarketdataController = MarketdataController_1 = class MarketdataController {
    marketdataService;
    logger = new common_1.Logger(MarketdataController_1.name);
    constructor(marketdataService) {
        this.marketdataService = marketdataService;
    }
    async getHistoricalData(symbol, interval, toDate, fromDate) {
        if (!symbol || !interval || !toDate || !fromDate) {
            throw new common_1.HttpException('Missing required query parameters: symbol, interval, to, from', common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.log(`Received request for historical data: ${symbol}, Interval: ${interval}, From: ${fromDate}, To: ${toDate}`);
        try {
            const data = await this.marketdataService.getHistoricalDataAndIndicators(symbol, interval, toDate, fromDate);
            return data;
        }
        catch (error) {
            this.logger.error(`Error fetching historical data for ${symbol}: ${error.message}`, error.stack);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to retrieve historical market data.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.MarketdataController = MarketdataController;
__decorate([
    (0, common_1.Get)('historical'),
    __param(0, (0, common_1.Query)('symbol')),
    __param(1, (0, common_1.Query)('interval')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('from')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], MarketdataController.prototype, "getHistoricalData", null);
exports.MarketdataController = MarketdataController = MarketdataController_1 = __decorate([
    (0, common_1.Controller)('marketdata'),
    __metadata("design:paramtypes", [marketdata_service_1.MarketdataService])
], MarketdataController);
//# sourceMappingURL=marketdata.controller.js.map