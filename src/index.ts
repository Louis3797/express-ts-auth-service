import app from './app';
import config from './config/config';
import logger from './middleware/logger';

const server = app.listen(parseInt(config.server.port), () => {
  logger.log('info', `Server is running on Port: ${config.server.port}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  logger.info('Closing server.');
  server.close((err) => {
    logger.info('Server closed.');
    process.exit(err ? 1 : 0);
  });
});
