import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { randomUUID } from 'crypto';
import * as argon2 from 'argon2';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import prismaClient from '../config/prisma';
import type {
  TypedRequest,
  UserLoginCredentials,
  UserSignUpCredentials
} from '../types/types';
import {
  createAccessToken,
  createRefreshToken
} from '../utils/generateTokens.util';
import config from '../config/config';

import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig
} from '../config/cookieConfig';

import { sendVerifyEmail } from '../utils/sendEmail.util';
import logger from '../middleware/logger';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { verify } = jwt;

/**
 * This function handles the signup process for new users. It expects a request object with the following properties:
 *
 * @param {TypedRequest<UserSignUpCredentials>} req - The request object that includes user's username, email, and password.
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 400 BAD REQUEST status code and an error message if the request body is missing any required parameters.
 *   - A 409 CONFLICT status code if the user email already exists in the database.
 *   - A 201 CREATED status code and a success message if the new user is successfully created and a verification email is sent.
 *   - A 500 INTERNAL SERVER ERROR status code if there is an error in the server.
 */
export const handleSignUp = async (
  req: TypedRequest<UserSignUpCredentials>,
  res: Response
) => {
  const { username, email, password } = req.body;

  // check req.body values
  if (!username || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Username, email and password are required!'
    });
  }

  const checkUserEmail = await prismaClient.user.findUnique({
    where: {
      email
    }
  });

  if (checkUserEmail) return res.sendStatus(httpStatus.CONFLICT); // email is already in db

  try {
    const hashedPassword = await argon2.hash(password);

    const newUser = await prismaClient.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword
      }
    });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await prismaClient.emailVerificationToken.create({
      data: {
        token,
        expiresAt,
        userId: newUser.id
      }
    });

    // Send an email with the verification link
    sendVerifyEmail(email, token);

    res.status(httpStatus.CREATED).json({ message: 'New user created' });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * This function handles the login process for users. It expects a request object with the following properties:
 *
 * @param {TypedRequest<UserLoginCredentials>} req - The request object that includes user's email and password.
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 400 BAD REQUEST status code and an error message if the request body is missing any required parameters.
 *   - A 401 UNAUTHORIZED status code if the user email does not exist in the database or the email is not verified or the password is incorrect.
 *   - A 200 OK status code and an access token if the login is successful and a new refresh token is stored in the database and a new refresh token cookie is set.
 *   - A 500 INTERNAL SERVER ERROR status code if there is an error in the server.
 */
export const handleLogin = async (
  req: TypedRequest<UserLoginCredentials>,
  res: Response
) => {
  const cookies = req.cookies;

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Email and password are required!' });
  }

  const user = await prismaClient.user.findUnique({
    where: {
      email
    }
  });

  if (!user) return res.sendStatus(httpStatus.UNAUTHORIZED);

  // check if email is verified
  if (!user.emailVerified) {
    res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Your email is not verified! Please confirm your email!'
    });
  }

  // check password
  try {
    if (await argon2.verify(user.password, password)) {
      // if there is a refresh token in the req.cookie, then we need to check if this
      // refresh token exists in the database and belongs to the current user than we need to delete it
      // if the token does not belong to the current user, then we delete all refresh tokens
      // of the user stored in the db to be on the safe site
      // we also clear the cookie in both cases
      if (cookies?.[config.jwt.refresh_token.cookie_name]) {
        // check if the given refresh token is from the current user
        const checkRefreshToken = await prismaClient.refreshToken.findUnique({
          where: {
            token: cookies[config.jwt.refresh_token.cookie_name]
          }
        });

        // if this token does not exists int the database or belongs to another user,
        // then we clear all refresh tokens from the user in the db
        if (!checkRefreshToken || checkRefreshToken.userId !== user.id) {
          await prismaClient.refreshToken.deleteMany({
            where: {
              userId: user.id
            }
          });
        } else {
          // else everything is fine and we just need to delete the one token
          await prismaClient.refreshToken.delete({
            where: {
              token: cookies[config.jwt.refresh_token.cookie_name]
            }
          });
        }

        // also clear the refresh token in the cookie
        res.clearCookie(
          config.jwt.refresh_token.cookie_name,
          clearRefreshTokenCookieConfig
        );
      }

      const accessToken = createAccessToken(user.id);

      const newRefreshToken = createRefreshToken(user.id);

      // store new refresh token in db
      await prismaClient.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id
        }
      });

      // save refresh token in cookie
      res.cookie(
        config.jwt.refresh_token.cookie_name,
        newRefreshToken,
        refreshTokenCookieConfig
      );

      // send access token per json to user so it can be stored in the localStorage
      return res.json({ accessToken });
    } else {
      return res.status(httpStatus.UNAUTHORIZED);
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * This function handles the logout process for users. It expects a request object with the following properties:
 *
 * @param {TypedRequest} req - The request object that includes a cookie with a valid refresh token
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 204 NO CONTENT status code if the refresh token cookie is undefined
 *   - A 204 NO CONTENT status code if the refresh token does not exists in the database
 *   - A 204 NO CONTENT status code if the refresh token cookie is successfully cleared
 */
export const handleLogout = async (req: TypedRequest, res: Response) => {
  const cookies = req.cookies;

  if (!cookies[config.jwt.refresh_token.cookie_name]) {
    return res.sendStatus(httpStatus.NO_CONTENT); // No content
  }
  const refreshToken = cookies[config.jwt.refresh_token.cookie_name];

  // Is refreshToken in db?
  const foundRft = await prismaClient.refreshToken.findUnique({
    where: { token: refreshToken }
  });

  if (!foundRft) {
    res.clearCookie(
      config.jwt.refresh_token.cookie_name,
      clearRefreshTokenCookieConfig
    );
    return res.sendStatus(httpStatus.NO_CONTENT);
  }

  // Delete refreshToken in db
  await prismaClient.refreshToken.delete({
    where: { token: refreshToken }
  });

  res.clearCookie(
    config.jwt.refresh_token.cookie_name,
    clearRefreshTokenCookieConfig
  );
  return res.sendStatus(httpStatus.NO_CONTENT);
};

/**
 * This function handles the refresh process for users. It expects a request object with the following properties:
 *
 * @param {Request} req - The request object that includes a cookie with a valid refresh token
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 401 UNAUTHORIZED status code if the refresh token cookie is undefined
 *   - A 403 FORBIDDEN status code if a refresh token reuse was detected but the token wasn't valid
 *   - A 403 FORBIDDEN status code if a refresh token reuse was detected but the token was valid
 *   - A 403 FORBIDDEN status code if the token wasn't valid
 *   - A 200 OK status code if the token was valid and the user was granted a new refresh and access token
 */
export const handleRefresh = async (req: Request, res: Response) => {
  const refreshToken: string | undefined =
    req.cookies[config.jwt.refresh_token.cookie_name];

  if (!refreshToken) return res.sendStatus(httpStatus.UNAUTHORIZED);

  // clear refresh cookie
  res.clearCookie(
    config.jwt.refresh_token.cookie_name,
    clearRefreshTokenCookieConfig
  );

  // check if refresh token is in db
  const foundRefreshToken = await prismaClient.refreshToken.findUnique({
    where: {
      token: refreshToken
    }
  });

  // Detected refresh token reuse!
  if (!foundRefreshToken) {
    verify(
      refreshToken,
      config.jwt.refresh_token.secret,
      async (err: unknown, payload: JwtPayload) => {
        if (err) return res.sendStatus(httpStatus.FORBIDDEN);

        logger.warn('Attempted refresh token reuse!');

        // Delete all tokens of the user because we detected that a token was stolen from him
        await prismaClient.refreshToken.deleteMany({
          where: {
            userId: payload.userId
          }
        });
      }
    );
    return res.status(httpStatus.FORBIDDEN);
  }

  // delete from db
  await prismaClient.refreshToken.delete({
    where: {
      token: refreshToken
    }
  });

  // evaluate jwt
  verify(
    refreshToken,
    config.jwt.refresh_token.secret,
    async (err: unknown, payload: JwtPayload) => {
      if (err || foundRefreshToken.userId !== payload.userId) {
        return res.sendStatus(httpStatus.FORBIDDEN);
      }

      // Refresh token was still valid
      const accessToken = createAccessToken(payload.userId);

      const newRefreshToken = createRefreshToken(payload.userId);

      // add refresh token to db
      await prismaClient.refreshToken
        .create({
          data: {
            token: newRefreshToken,
            userId: payload.userId
          }
        })
        .catch((err: Error) => {
          logger.error(err);
        });

      // Creates Secure Cookie with refresh token
      res.cookie(
        config.jwt.refresh_token.cookie_name,
        newRefreshToken,
        refreshTokenCookieConfig
      );

      return res.json({ accessToken });
    }
  );
};
