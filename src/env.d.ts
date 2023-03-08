declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'production' | 'development' | 'staging';
    readonly PORT: number;
    readonly CORS_ORIGIN: string;
    readonly JWT_SECRET: string;
    readonly JWT_EXPIRE: string;
    readonly MYSQL_DATABASE: string;
    readonly MYSQL_ROOT_PASSWORD: string;
    readonly DATABASE_URL: string;
  }
}
