import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  server_url: process.env.SERVER_URL,
  cors_origin: process.env.CORS_ORIGIN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expire: process.env.ACCESS_TOKEN_EXPIRE,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRE,
  refresh_token_cookie_name: process.env.REFRESH_TOKEN_COOKIE_NAME,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  smtp_username: process.env.SMTP_USERNAME,
  smtp_password: process.env.SMTP_PASSWORD,
  email_from: process.env.EMAIL_FROM,
} as const;

export default config;
