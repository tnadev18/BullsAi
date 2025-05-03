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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AuthService = AuthService_1 = class AuthService {
    configService;
    httpService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
    }
    getUpstoxAuthUrl() {
        const clientId = this.configService.getOrThrow('UPSTOX_CLIENT_ID');
        const redirectUri = this.configService.getOrThrow('UPSTOX_REDIRECT_URI');
        const authUrl = this.configService.getOrThrow('UPSTOX_AUTH_URL');
        const encodedRedirectUri = encodeURIComponent(redirectUri);
        const url = `${authUrl}?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&response_type=code&state=RANDOM_STATE_STRING`;
        this.logger.log(`Generated Upstox Auth URL`);
        return url;
    }
    async handleUpstoxCallback(code) {
        this.logger.log(`Handling Upstox callback with code: ${code ? '******' : 'null'}`);
        const clientId = this.configService.getOrThrow('UPSTOX_CLIENT_ID');
        const clientSecret = this.configService.getOrThrow('UPSTOX_CLIENT_SECRET');
        const redirectUri = this.configService.getOrThrow('UPSTOX_REDIRECT_URI');
        const tokenUrl = this.configService.getOrThrow('UPSTOX_TOKEN_URL');
        const headers = {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        const data = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
            code: code,
        }).toString();
        this.logger.log(`Requesting token from Upstox at ${tokenUrl}`);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(tokenUrl, data, { headers }).pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error('Error exchanging Upstox code:', error.response?.data || error.message);
                if (error.response) {
                    this.logger.error(`Status: ${error.response.status}, Headers: ${JSON.stringify(error.response.headers)}`);
                }
                throw new Error('Failed to exchange Upstox authorization code.');
            })));
            this.logger.log('Successfully obtained token data from Upstox.');
            return response.data;
        }
        catch (error) {
            this.logger.error(`Caught error during token exchange: ${error.message}`);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map