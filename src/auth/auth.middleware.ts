import { Injectable, NestMiddleware, Req, Res } from '@nestjs/common';
import { middleware } from 'supertokens-node/framework/express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly supertokensMiddleware: any;

  constructor() {
    this.supertokensMiddleware = middleware();
  }

  use(@Req() req: any, @Res() res: any, next: () => void) {
    const cookies = req.headers.cookie;
    const accessToken = cookies?.split(';').find(cookie => cookie.includes('sAccessToken'));
    const refreshToken = cookies?.split(';').find(cookie => cookie.includes('sRefreshToken'));

    if (!accessToken && refreshToken) {
      res.clearCookie('sIdRefreshToken');
      res.redirect('/sign-in');
    }

    return this.supertokensMiddleware(req, res, next);
  }
}
