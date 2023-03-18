import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import prismaClient from '../config/prisma';
import * as argon2 from 'argon2';
import type {
  EmailRequestBody,
  ResetPasswordRequestBodyType,
  TypedRequest,
  UserLoginCredentials,
  UserSignUpCredentials,
} from '../types/types';
import {
  createAccessToken,
  createRefreshToken,
} from '../utils/generateTokens.util';
import config from '../config/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from '../config/cookieConfig';
import { v4 as uuidv4 } from 'uuid';
import { sendResetEmail, sendVerifyEmail } from '../utils/sendEmail.util';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { verify } = jwt;

/**
 * Handles Signup
 * @param req
 * @param res
 * @returns
 */
export const handleSingUp = async (
  req: TypedRequest<UserSignUpCredentials>,
  res: Response
) => {
  const { username, email, password } = req.body;

  // check req.body values
  if (!username || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Username, email and password are required!',
    });
  }

  const checkUserEmail = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (checkUserEmail) return res.sendStatus(httpStatus.CONFLICT); // email is already in db

  try {
    const hashedPassword = await argon2.hash(password as string);

    const newUser = await prismaClient.user.create({
      data: {
        name: username,
        email: email,
        password: hashedPassword,
      },
    });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour
    await prismaClient.emailVerificationToken.create({
      data: {
        token: token,
        expiresAt: expiresAt,
        userId: newUser.id,
      },
    });

    // Send an email with the verification link
    sendVerifyEmail(email, token);

    res.status(httpStatus.CREATED).json({ message: 'New user created' });
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Handles Login
 * @param req
 * @param res
 * @returns
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
      email: email,
    },
  });

  if (!user) return res.sendStatus(httpStatus.UNAUTHORIZED);

  // check if email is verified
  if (!user.emailVerified) {
    res.send(httpStatus.UNAUTHORIZED).json({
      message: 'Your email is not verified! Please confirm your email!',
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
      if (cookies?.jid) {
        // check if the given refresh token is from the current user
        const checkRefreshToken = await prismaClient.refreshToken.findUnique({
          where: {
            token: cookies.jid,
          },
        });

        // if this token does not exists int the database or belongs to another user,
        // then we clear all refresh tokens from the user in the db
        if (!checkRefreshToken || checkRefreshToken.userId != user.id) {
          await prismaClient.refreshToken.deleteMany({
            where: {
              userId: user.id,
            },
          });
        } else {
          // else everything is fine and we just need to delete the one token
          await prismaClient.refreshToken.delete({
            where: {
              token: cookies.jid,
            },
          });
        }

        // also clear the refresh token in the cookie
        res.clearCookie(
          config.refresh_token_cookie_name,
          clearRefreshTokenCookieConfig
        );
      }

      const accessToken = createAccessToken(user.id);

      const newRefreshToken = createRefreshToken(user.id);

      // store new refresh token in db
      await prismaClient.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
        },
      });

      // save refresh token in cookie
      res.cookie(
        config.refresh_token_cookie_name,
        newRefreshToken,
        refreshTokenCookieConfig
      );

      // send access token per json to user so it can be stored in the localStorage
      return res.json({ accessToken });
    } else {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Handles Logout
 * @param req
 * @param res
 * @returns
 */
export const handleLogout = async (req: TypedRequest, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jid) return res.sendStatus(httpStatus.NO_CONTENT); //No content
  const refreshToken = cookies.jid;

  // Is refreshToken in db?
  const foundRft = await prismaClient.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!foundRft) {
    res.clearCookie(
      config.refresh_token_cookie_name,
      clearRefreshTokenCookieConfig
    );
    return res.sendStatus(httpStatus.NO_CONTENT);
  }

  // Delete refreshToken in db
  await prismaClient.refreshToken.delete({
    where: { token: refreshToken },
  });

  res.clearCookie(
    config.refresh_token_cookie_name,
    clearRefreshTokenCookieConfig
  );
  res.sendStatus(httpStatus.NO_CONTENT);
};

/**
 * Handles refreshing for access tokens
 * @param req
 * @param res
 * @returns
 */
export const handleRefresh = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jid) return res.send(httpStatus.UNAUTHORIZED);

  const refreshToken = cookies.jid;

  res.clearCookie(
    config.refresh_token_cookie_name,
    clearRefreshTokenCookieConfig
  );

  // check if refresh token is in db
  const foundRefreshToken = await prismaClient.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  // Detected refresh token reuse!
  if (!foundRefreshToken) {
    verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err: unknown, payload: JwtPayload) => {
        if (err) return res.sendStatus(httpStatus.FORBIDDEN);
        console.log('attempted refresh token reuse!');
        await prismaClient.refreshToken.deleteMany({
          where: {
            userId: payload.userId,
          },
        });
      }
    );
    return res.sendStatus(httpStatus.FORBIDDEN);
  }

  // delete from db
  prismaClient.refreshToken.delete({
    where: {
      token: refreshToken,
    },
  });

  // evaluate jwt
  verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err: unknown, payload: JwtPayload) => {
      if (err || foundRefreshToken.userId !== payload.userId)
        return res.sendStatus(httpStatus.FORBIDDEN);

      // Refresh token was still valid
      const accessToken = createAccessToken(payload.userId);

      const newRefreshToken = createRefreshToken(payload.userId);

      // add refresh token to db
      await prismaClient.refreshToken.create({
        data: {
          token: refreshToken,
          userId: payload.userId,
        },
      });

      // Creates Secure Cookie with refresh token
      res.cookie(
        config.refresh_token_cookie_name,
        newRefreshToken,
        refreshTokenCookieConfig
      );

      res.json({ accessToken });
    }
  );
};

/**
 * Sends Forgot password email
 * @param req
 * @param res
 * @returns
 */
export const handleForgotPassword = async (
  req: TypedRequest<EmailRequestBody>,
  res: Response
) => {
  const { email } = req.body;

  // check req.body values
  if (!email) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Email is required!',
    });
  }

  // Check if the email exists in the database
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(httpStatus.CONFLICT).json({ error: 'User not found' });
  }

  // Generate a reset token and save it to the database
  const resetToken = uuidv4();
  const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour
  await prismaClient.resetToken.create({
    data: {
      token: resetToken,
      expiresAt: expiresAt,
      userId: user.id,
    },
  });

  // Send an email with the reset link
  sendResetEmail(email, resetToken);

  // Return a success message
  res.status(httpStatus.OK).json({ message: 'Password reset email sent' });
};

/**
 * Handles Password reset
 * @param req
 * @param res
 * @returns
 */
export const handleResetPassword = async (
  req: TypedRequest<ResetPasswordRequestBodyType>,
  res: Response
) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token) return res.sendStatus(httpStatus.NOT_FOUND);

  if (!newPassword) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'New password is required!' });
  }

  // Check if the token exists in the database and is not expired
  const resetToken = await prismaClient.resetToken.findFirst({
    where: { token: token as string, expiresAt: { gt: new Date() } },
  });

  if (!resetToken) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ error: 'Invalid or expired token' });
  }

  // Update the user's password in the database
  const hashedPassword = await argon2.hash(newPassword);
  await prismaClient.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // Delete the reset and all other reset tokens that the user owns from the database
  await prismaClient.resetToken.deleteMany({
    where: { userId: resetToken.userId },
  });

  // Return a success message
  res.status(httpStatus.OK).json({ message: 'Password reset successful' });
};

/**
 * Sends Verification email
 * @param req
 * @param res
 * @returns
 */
export const sendVerificationEmail = async (
  req: TypedRequest<EmailRequestBody>,
  res: Response
) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Email is required!' });
  }

  // Check if the email exists in the database
  const user = await prismaClient.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true },
  });

  if (!user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: 'Email not found' });
  }

  // Check if the user's email is already verified
  if (user.emailVerified) {
    return res
      .status(httpStatus.CONFLICT)
      .json({ error: 'Email already verified' });
  }

  // Check if there is an existing verification token that has not expired
  const existingToken = await prismaClient.emailVerificationToken.findFirst({
    where: {
      user: { id: user.id },
      expiresAt: { gt: new Date() },
    },
  });

  if (existingToken) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: 'Verification email already sent' });
  }

  // Generate a new verification token and save it to the database
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour
  await prismaClient.emailVerificationToken.create({
    data: {
      token: token,
      expiresAt: expiresAt,
      userId: user.id,
    },
  });

  // Send an email with the new verification link
  sendVerifyEmail(email, token);

  // Return a success message
  res.status(httpStatus.OK).json({ message: 'Verification email sent' });
};

export const handleVerifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) return res.sendStatus(httpStatus.NOT_FOUND);

  // Check if the token exists in the database and is not expired
  const verificationToken = await prisma?.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || verificationToken.expiresAt < new Date()) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ error: 'Invalid or expired token' });
  }

  // Update the user's email verification status in the database
  await prismaClient.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerified: new Date() },
  });

  // Delete the verification tokens that the user owns form the database
  await prismaClient.emailVerificationToken.deleteMany({
    where: { userId: verificationToken.userId },
  });

  // Return a success message
  res.status(200).json({ message: 'Email verification successful' });
};
