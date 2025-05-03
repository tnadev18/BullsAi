import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  getUpstoxAuthUrl(): string {
    const clientId = this.configService.getOrThrow<string>('UPSTOX_CLIENT_ID');
    const redirectUri = this.configService.getOrThrow<string>('UPSTOX_REDIRECT_URI');
    const authUrl = this.configService.getOrThrow<string>('UPSTOX_AUTH_URL');

    // Ensure redirectUri is encoded
    const encodedRedirectUri = encodeURIComponent(redirectUri);
    const url = `${authUrl}?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&response_type=code&state=RANDOM_STATE_STRING`; // Added state for security
    this.logger.log(`Generated Upstox Auth URL`); // Don't log sensitive parts like full URL if unnecessary
    return url;
  }

  async handleUpstoxCallback(code: string): Promise<any> { // Define a proper type later
    this.logger.log(`Handling Upstox callback with code: ${code ? '******' : 'null'}`);
    const clientId = this.configService.getOrThrow<string>('UPSTOX_CLIENT_ID');
    const clientSecret = this.configService.getOrThrow<string>('UPSTOX_CLIENT_SECRET');
    const redirectUri = this.configService.getOrThrow<string>('UPSTOX_REDIRECT_URI');
    const tokenUrl = this.configService.getOrThrow<string>('UPSTOX_TOKEN_URL');

    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      // Upstox might require 'Api-Version' header, check their docs
      // 'Api-Version': '2.0'
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
      const response = await firstValueFrom(
        this.httpService.post(tokenUrl, data, { headers }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error('Error exchanging Upstox code:', error.response?.data || error.message);
            if (error.response) {
               this.logger.error(`Status: ${error.response.status}, Headers: ${JSON.stringify(error.response.headers)}`);
            }
            // Rethrow a more specific error or handle it
            throw new Error('Failed to exchange Upstox authorization code.');
          }),
        ),
      );

      this.logger.log('Successfully obtained token data from Upstox.');
      // **SECURITY TODO:**
      // 1. Validate the 'state' parameter received against the one sent initially.
      // 2. Store the access_token and refresh_token securely (e.g., encrypted in DB).
      // 3. Associate tokens with the logged-in user.
      // 4. Implement token refresh logic.
      return response.data; // Contains access_token, user details, etc.
    } catch (error) {
      this.logger.error(`Caught error during token exchange: ${error.message}`);
      throw error; // Re-throw after logging
    }
  }
}