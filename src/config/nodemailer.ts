import nodemailer, { type Transporter } from 'nodemailer';
import logger from '../middleware/logger';
import config from './config';

let transporter: Transporter | null = null;

const createTestAccount = async () => {
  try {
    const account = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });
    logger.info(`Test account created: ${account.user}`);
    console.log(account);
  } catch (error) {
    console.error('Failed to create a test account:', error);
  }
};

if (config.node_env === 'production') {
  transporter = nodemailer.createTransport({
    host: config.email.smtp.host,
    port: parseInt(config.email.smtp.port),
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.smtp.auth.username,
      pass: config.email.smtp.auth.password
    }
  });
} else {
  void createTestAccount();
}

export default transporter;
