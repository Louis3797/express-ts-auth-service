import type { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import config from '../config/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { sign } = jwt;

export const createAccessToken = (user: User) => {
  return sign({ userID: user.id }, config.access_token_secret, {
    expiresIn: config.access_token_expire,
  });
};

export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id }, config.refresh_token_secret, {
    expiresIn: config.refresh_token_expire,
  });
};
