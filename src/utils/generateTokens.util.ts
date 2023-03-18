import jwt from 'jsonwebtoken';
import config from '../config/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { sign } = jwt;

export const createAccessToken = (userId: number | string): string => {
  return sign({ userID: userId }, config.access_token_secret, {
    expiresIn: config.access_token_expire,
  });
};

export const createRefreshToken = (userId: number | string): string => {
  return sign({ userId: userId }, config.refresh_token_secret, {
    expiresIn: config.refresh_token_expire,
  });
};
