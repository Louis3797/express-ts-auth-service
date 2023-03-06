import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import shouldCompress from './utils/compressFilter.util';

dotenv.config();

const app: Express = express();

app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    origin: [process.env.CORS_ORIGIN],
    credentials: true,
  })
);

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: shouldCompress }));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;
