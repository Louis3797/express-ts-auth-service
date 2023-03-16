import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import compressFilter from './utils/compressFilter.util';
import config from './config/config';
import { authRouter, userRouter } from './routes/v1';
import isAuth from './middleware/isAuth';

const app: Express = express();

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    origin: [config.cors_origin],
    credentials: true,
  })
);

// Todo -> rate limiting auth routes ??

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/user', userRouter);

app.use('/secret', isAuth, (req, res) => {
  res.json({
    message: 'You can see me',
  });
});

// Todo -> Error handling

export default app;
