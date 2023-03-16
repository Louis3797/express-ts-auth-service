import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import config from '../config/config';

// Why does 'jsonwebtoken' not support es6 module support ?????
// Maybe in future this will be added.....
// GitHub Issue for this problem: https://github.com/auth0/node-jsonwebtoken/issues/655
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { verify } = jwt;

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  // token looks like 'Bearer vnjaknvijdaknvikbnvreiudfnvriengviewjkdsbnvierj'

  const authHeader =
    req.headers.authorization ||
    (req.headers['Authorization'] as string | undefined);

  if (!authHeader || !authHeader?.startsWith('Bearer '))
    return res.sendStatus(httpStatus.UNAUTHORIZED);

  const token: Jwt | undefined = authHeader.split(' ')[1];

  verify(
    token,
    config.access_token_secret,
    (err: unknown, payload: JwtPayload) => {
      if (err) return res.sendStatus(httpStatus.FORBIDDEN); //invalid token
      req.payload = payload;

      next();
    }
  );
};

export default isAuth;
