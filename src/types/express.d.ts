declare namespace Express {
  export interface Request {
    payload?: { userId: string };
  }
}
