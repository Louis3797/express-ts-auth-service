import jwt from 'jsonwebtoken';
import config from '../config/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { sign } = jwt;

export const createAccessToken = (userId: number | string): string => {
  return sign({ userID: userId }, config.jwt.access_token.secret, {
    expiresIn: config.jwt.access_token.expire
  });
};

export const createRefreshToken = (userId: number | string): string => {
  return sign({ userId }, config.jwt.refresh_token.secret, {
    expiresIn: config.jwt.refresh_token.expire
  });
};
