import type { NextFunction, Request, Response } from 'express';

// See this for the following types
// https://stackoverflow.com/questions/34508081/how-to-add-typescript-definitions-to-express-req-res
// https://stackoverflow.com/questions/61132262/typescript-deep-partial

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// More strictly typed Express.Request type
export type TypedRequest<
  ReqBody = Record<string, unknown>,
  QueryString = Record<string, unknown>
> = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  DeepPartial<ReqBody>,
  DeepPartial<QueryString>
>;

// More strictly typed express middleware type
export type ExpressMiddleware<
  ReqBody = Record<string, unknown>,
  Res = Record<string, unknown>,
  QueryString = Record<string, unknown>
> = (
  req: TypedRequest<ReqBody, QueryString>,
  res: Response<Res>,
  next: NextFunction
) => Promise<void> | void;

// Example usage from Stackoverflow:
// type Req = { email: string; password: string };

// type Res = { message: string };

// export const signupUser: ExpressMiddleware<Req, Res> = async (req, res) => {
//   /* strongly typed `req.body`. yay autocomplete 🎉 */
//   res.json({ message: 'you have signed up' }) // strongly typed response obj
// };
export type UserSignUpCredentials = {
  username: string;
  email: string;
  password: string;
};

export type UserLoginCredentials = Omit<UserSignUpCredentials, 'username'>;
