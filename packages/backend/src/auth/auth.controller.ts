import { Controller, Get, Query, Res, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express'; // Import Response type from express

@Controller('auth') // Route prefix: /api/auth
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // GET /api/auth/upstox
  @Get('upstox')
  initiateUpstoxLogin(@Res() res: Response) {
    try {
      const authUrl = this.authService.getUpstoxAuthUrl();
      this.logger.log(`Redirecting user to Upstox for authorization...`);
      res.redirect(authUrl);
    } catch (error) {
        this.logger.error(`Failed to generate Upstox auth URL: ${error.message}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to initiate login.');
    }
  }

  // GET /api/auth/upstox/callback
  @Get('upstox/callback')
  async handleUpstoxCallback(
    @Query('code') code: string,
    @Query('state') state: string, // Capture state parameter
    @Res() res: Response
  ) {
    this.logger.log(`Received callback from Upstox.`);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

    if (!code) {
      this.logger.error('Authorization code missing in Upstox callback.');
      // Redirect back to frontend with error flag
      res.redirect(`${frontendUrl}?error=missing_code`);
      // throw new HttpException('Authorization code not found', HttpStatus.BAD_REQUEST);
      return;
    }

    // **SECURITY TODO:** Validate the received 'state' parameter here against a stored value (e.g., in session)
    // if (state !== expectedState) {
    //   this.logger.error('Invalid state parameter received.');
    //   res.redirect(`${frontendUrl}?error=invalid_state`);
    //   return;
    // }

    try {
      const tokenData = await this.authService.handleUpstoxCallback(code);
      this.logger.log('Successfully processed Upstox callback.');

      // **TODO:** Securely handle the token data:
      // 1. Create/update user session.
      // 2. Set a secure HTTP-only cookie with a session token/JWT.
      // 3. Store Upstox tokens associated with the user in your database.

      // Placeholder: Redirect back to frontend indicating success
      res.redirect(`${frontendUrl}?login_success=true`);
      // Example response if needed by frontend JS instead of redirect:
      // res.status(HttpStatus.OK).json({ message: 'Login successful', /* potentially sanitized user data */ });

    } catch (error) {
      this.logger.error(`Error handling Upstox callback: ${error.message}`, error.stack);
      // Redirect back to frontend indicating failure
      res.redirect(`${frontendUrl}?error=auth_failed`);
      // throw new HttpException('Failed to authenticate with Upstox', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}