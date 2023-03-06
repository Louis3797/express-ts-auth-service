import app from './app';
import logger from './middleware/logger';

app.listen(parseInt(process.env.PORT), () => {
  logger.log('info', `Server is running on Port: ${process.env.PORT}`);
});
