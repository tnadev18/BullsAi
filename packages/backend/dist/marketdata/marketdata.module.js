"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketdataModule = void 0;
const common_1 = require("@nestjs/common");
const marketdata_service_1 = require("./marketdata.service");
const marketdata_controller_1 = require("./marketdata.controller");
const axios_1 = require("@nestjs/axios");
let MarketdataModule = class MarketdataModule {
};
exports.MarketdataModule = MarketdataModule;
exports.MarketdataModule = MarketdataModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule
        ],
        controllers: [marketdata_controller_1.MarketdataController],
        providers: [marketdata_service_1.MarketdataService],
    })
], MarketdataModule);
//# sourceMappingURL=marketdata.module.js.map