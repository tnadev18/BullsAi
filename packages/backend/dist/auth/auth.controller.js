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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
let AuthController = AuthController_1 = class AuthController {
    authService;
    configService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    initiateUpstoxLogin(res) {
        try {
            const authUrl = this.authService.getUpstoxAuthUrl();
            this.logger.log(`Redirecting user to Upstox for authorization...`);
            res.redirect(authUrl);
        }
        catch (error) {
            this.logger.error(`Failed to generate Upstox auth URL: ${error.message}`);
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to initiate login.');
        }
    }
    async handleUpstoxCallback(code, state, res) {
        this.logger.log(`Received callback from Upstox.`);
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
        if (!code) {
            this.logger.error('Authorization code missing in Upstox callback.');
            res.redirect(`${frontendUrl}?error=missing_code`);
            return;
        }
        try {
            const tokenData = await this.authService.handleUpstoxCallback(code);
            this.logger.log('Successfully processed Upstox callback.');
            res.redirect(`${frontendUrl}?login_success=true`);
        }
        catch (error) {
            this.logger.error(`Error handling Upstox callback: ${error.message}`, error.stack);
            res.redirect(`${frontendUrl}?error=auth_failed`);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('upstox'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "initiateUpstoxLogin", null);
__decorate([
    (0, common_1.Get)('upstox/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleUpstoxCallback", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map