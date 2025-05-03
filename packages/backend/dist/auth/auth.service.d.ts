import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export declare class AuthService {
    private readonly configService;
    private readonly httpService;
    private readonly logger;
    constructor(configService: ConfigService, httpService: HttpService);
    getUpstoxAuthUrl(): string;
    handleUpstoxCallback(code: string): Promise<any>;
}
