import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import { sanitize } from 'src/utils/sanitize.util';
import type { ExpressMiddleware, XssMiddlewareOptions } from '../types/types';

export const xssMiddleware = (
  options: XssMiddlewareOptions = {}
): ExpressMiddleware => {
  return (req, _res, next) => {
    if (options.body && req.body) {
      req.body = sanitize(req.body);
    }
    if (options.query && req.query) {
      req.query = sanitize(req.query) as unknown as ParsedQs;
    }
    if (options.params && req.params) {
      req.params = sanitize(req.params) as unknown as ParamsDictionary;
    }
    next();
  };
};
