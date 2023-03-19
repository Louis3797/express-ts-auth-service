import type { CookieOptions } from 'express';

export const refreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  maxAge: 24 * 60 * 60 * 1000
};

export const clearRefreshTokenCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true
};
