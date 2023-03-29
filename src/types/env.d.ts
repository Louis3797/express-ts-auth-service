declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NODE_ENV: 'production' | 'development' | 'test';
    readonly PORT: string;
    readonly SERVER_URL: string;
    readonly CORS_ORIGIN: string;
    readonly ACCESS_TOKEN_SECRET: string;
    readonly ACCESS_TOKEN_EXPIRE: string;
    readonly REFRESH_TOKEN_SECRET: string;
    readonly REFRESH_TOKEN_EXPIRE: string;
    readonly REFRESH_TOKEN_COOKIE_NAME: string;
    readonly MYSQL_DATABASE: string;
    readonly MYSQL_ROOT_PASSWORD: string;
    readonly DATABASE_URL: string;
    readonly SMTP_HOST: string;
    readonly SMTP_PORT: string;
    readonly SMTP_USERNAME: string;
    readonly SMTP_PASSWORD: string;
    readonly EMAIL_FROM: string;
  }
}
