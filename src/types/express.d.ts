import type { JwtPayload } from 'jsonwebtoken';
declare global {
  namespace Express {
    export interface Request {
      payload?: JwtPayload;

      cookies: {
        jid?: string;
      };
    }
  }
}
