declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'production' | 'development' | 'staging';
    readonly PORT: string;
    readonly CORS_ORIGIN: string;
    readonly ACCESS_TOKEN_SECRET: string;
    readonly ACCESS_TOKEN_EXPIRE: string;
    readonly REFRESH_TOKEN_SECRET: string;
    readonly REFRESH_TOKEN_EXPIRE: string;
    readonly REFRESH_TOKEN_COOKIE_NAME: string;
    readonly MYSQL_DATABASE: string;
    readonly MYSQL_ROOT_PASSWORD: string;
    readonly DATABASE_URL: string;
  }
}
