/* eslint-disable @typescript-eslint/no-floating-promises */
import type { NextFunction, Request, Response } from 'express';
import { xssMiddleware } from '../../src/middleware/xssMiddleware';
import type { SanitizeOptions } from '../../src/types/types';

describe('xssMiddleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
  });

  it('should sanitize req.body, req.query, and req.params', () => {
    const options: SanitizeOptions = {
      whiteList: { b: [] }
    };
    req.body = { a: '<script>bad()</script>', b: '<b>good</b>' };
    req.query = { a: '<script>bad()</script>', b: '<b>good</b>' };
    req.params = { a: '<script>bad()</script>', b: '<b>good</b>' };

    xssMiddleware(options)(req, res, next);

    expect(req.body).toEqual({
      a: '&lt;script&gt;bad()&lt;/script&gt;',
      b: '<b>good</b>'
    });
    expect(req.query).toEqual({
      a: '&lt;script&gt;bad()&lt;/script&gt;',
      b: '<b>good</b>'
    });
    expect(req.params).toEqual({
      a: '&lt;script&gt;bad()&lt;/script&gt;',
      b: '<b>good</b>'
    });
  });

  it('should call next', () => {
    xssMiddleware()(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
