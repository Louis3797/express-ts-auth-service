import httpStatus from 'http-status';
import type { NextFunction, Request, Response } from 'express';
import isAuth from '../../src/middleware/isAuth';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../../src/config/config';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { sign } = jwt;

describe('isAuth middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      sendStatus: jest.fn()
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 401 if no authorization header is present', () => {
    isAuth(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with "Bearer "', () => {
    req.headers = { authorization: 'InvalidToken' };

    isAuth(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is undefined', () => {
    req.headers = { authorization: 'Bearer  ' };

    isAuth(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    req.headers = { authorization: 'Bearer InvalidToken' };

    isAuth(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.FORBIDDEN);
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if token is valid', () => {
    const payload: JwtPayload = { userId: '123' };
    const token = sign(payload, config.jwt.access_token.secret);

    req.headers = { authorization: `Bearer ${token}` };

    isAuth(req, res, next);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    expect(req.payload).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});
