import nodemailer, { Transporter } from 'nodemailer';
import config from './config';

let transporter: Transporter;

if (config.node_env === 'production') {
  transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: parseInt(config.smtp_port),
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.smtp_username,
      pass: config.smtp_password,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'i5w45aectlp3hdta@ethereal.email', // generated ethereal user
      pass: 'wkb7KbnCWKxBu2ktvR', // generated ethereal password
    },
  });
}

export default transporter;
