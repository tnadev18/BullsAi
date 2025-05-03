"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    const port = configService.get('PORT', 5000);
    const nodeEnv = configService.get('NODE_ENV', 'development');
    const frontendUrl = configService.get('FRONTEND_URL');
    app.enableCors({
        origin: frontendUrl || 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    await app.listen(port);
    logger.log(`🚀 Application is running in [${nodeEnv}] mode on: http://localhost:${port}/api`);
    logger.log(`🔌 CORS enabled for origin: ${frontendUrl || 'http://localhost:3000'}`);
}
bootstrap();
//# sourceMappingURL=main.js.map