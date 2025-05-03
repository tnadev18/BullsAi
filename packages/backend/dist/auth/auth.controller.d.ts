import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    private readonly logger;
    constructor(authService: AuthService, configService: ConfigService);
    initiateUpstoxLogin(res: Response): void;
    handleUpstoxCallback(code: string, state: string, res: Response): Promise<void>;
}
