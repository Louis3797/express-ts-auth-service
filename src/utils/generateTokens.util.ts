import jwt from 'jsonwebtoken';
import config from '../config/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { sign } = jwt;

/**
 * This functions generates a valid access token
 *
 * @param {number | string} userId - The user id of the user that owns this jwt
 * @returns Returns a valid access token
 */
export const createAccessToken = (userId: number | string): string => {
  return sign({ userID: userId }, config.jwt.access_token.secret, {
    expiresIn: config.jwt.access_token.expire
  });
};

/**
 * This functions generates a valid refresh token
 *
 * @param {number | string} userId - The user id of the user that owns this jwt
 * @returns Returns a valid refresh token
 */
export const createRefreshToken = (userId: number | string): string => {
  return sign({ userId }, config.jwt.refresh_token.secret, {
    expiresIn: config.jwt.refresh_token.expire
  });
};
