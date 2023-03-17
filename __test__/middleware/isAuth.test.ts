import httpStatus from 'http-status';
import type { Request, Response, NextFunction } from 'express';
import isAuth from '../..//src/middleware/isAuth';
import jwt, { JwtPayload } from 'jsonwebtoken';

describe('isAuth middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      sendStatus: jest.fn(),
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

  it('should return 403 if token is invalid', () => {
    req.headers = { authorization: 'Bearer InvalidToken' };

    isAuth(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(httpStatus.FORBIDDEN);
    expect(next).not.toHaveBeenCalled();
  });

  //   it('should call next() if token is valid', () => {
  //     req.headers = { authorization: 'Bearer validtoken' };

  //     const payload: JwtPayload = { userId: '1234' };

  //     const verify = jest.spyOn(jwt, 'verify');
  //  verify.mockImplementation(() => () => ({ verified: 'true' }));

  //     expect(verifyMock).toHaveBeenCalledWith(
  //       'validtoken',
  //       'your-access-token-secret',
  //       expect.any(Function)
  //     );
  //     expect(req.payload).toEqual(payload);
  //     expect(next).toHaveBeenCalled();
  //   });
});
