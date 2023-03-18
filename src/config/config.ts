import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  cors_origin: process.env.CORS_ORIGIN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expire: process.env.ACCESS_TOKEN_EXPIRE,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRE,
  refresh_token_cookie_name: process.env.REFRESH_TOKEN_COOKIE_NAME,
} as const;

export default config;
