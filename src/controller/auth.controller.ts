import type { Response } from 'express';
import httpStatus from 'http-status';
import prismaClient from '../config/prisma';
import * as argon2 from 'argon2';
import type { TypedRequest } from '../types/types';
import {
  createAccessToken,
  createRefreshToken,
} from '../utils/generateTokens.util';
import config from '../config/config';

type UserSignUpCredentials = {
  username: string;
  email: string;
  password: string;
};

type UserLoginCredentials = Omit<UserSignUpCredentials, 'username'>;

export const handleSingUp = async (
  req: TypedRequest<UserSignUpCredentials>,
  res: Response
) => {
  const { username, email, password } = req.body;

  console.log(req.body);
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

    await prismaClient.user.create({
      data: {
        name: username,
        email: email,
        password: hashedPassword,
      },
    });

    res.status(httpStatus.CREATED).json({ message: 'New user created' });
  } catch (err) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

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
  // if (!user.emailVerified) {
  //   res.send(httpStatus.UNAUTHORIZED).json({
  //     message: 'Your email is not verified! Please confirm your email!',
  //   });
  // }

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
        res.clearCookie(config.refresh_token_cookie_name, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
      }

      const accessToken = createAccessToken(user);

      const newRefreshToken = createRefreshToken(user);

      // store new refresh token in db
      await prismaClient.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
        },
      });

      // save refresh token in cookie
      res.cookie(config.refresh_token_cookie_name, newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      // send access token per json to user so it can be stored in the localStorage
      return res.json({ accessToken });
    } else {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  } catch (err) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleLogout = async (req: TypedRequest, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jid) return res.sendStatus(204); //No content
  const refreshToken = cookies.jid;

  // Is refreshToken in db?
  const foundRft = await prismaClient.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!foundRft) {
    res.clearCookie(config.refresh_token_cookie_name, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  await prismaClient.refreshToken.delete({
    where: { token: refreshToken },
  });

  res.clearCookie(config.refresh_token_cookie_name, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.sendStatus(204);
};

export function handleRefresh(arg0: string, handleRefresh: any) {
  throw new Error('Function not implemented.');
}
