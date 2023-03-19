import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const config = {
  node_env: process.env.NODE_ENV,
  server: {
    port: process.env.PORT,
    url: process.env.SERVER_URL
  },
  cors: {
    cors_origin: process.env.CORS_ORIGIN
  },
  jwt: {
    access_token: {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expire: process.env.ACCESS_TOKEN_EXPIRE
    },
    refresh_token: {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expire: process.env.REFRESH_TOKEN_EXPIRE,
      cookie_name: process.env.REFRESH_TOKEN_COOKIE_NAME
    }
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD
      }
    },
    from: process.env.EMAIL_FROM
  }
} as const;

export default config;
