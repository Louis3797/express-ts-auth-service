import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import { sanitize } from 'src/utils/sanitize.util';
import type { ExpressMiddleware } from '../types/types';

export const xssMiddleware = (): ExpressMiddleware => {
  return (req, _res, next) => {
    req.body = sanitize(req.body);
    req.query = sanitize(req.query) as unknown as ParsedQs;
    req.params = sanitize(req.params) as unknown as ParamsDictionary;

    next();
  };
};
