import nodemailer, { type Transporter } from 'nodemailer';
import config from './config';

let transporter: Transporter;

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
  // !! test account can expire
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'i5w45aectlp3hdta@ethereal.email', // generated ethereal user
      pass: 'wkb7KbnCWKxBu2ktvR' // generated ethereal password
    }
  });
}

export default transporter;
