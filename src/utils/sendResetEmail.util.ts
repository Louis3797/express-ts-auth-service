import logger from '../middleware/logger';
import transporter from '../config/nodemailer';

const sendResetEmail = (email: string, token: string) => {
  const resetLink = `https://example.com/reset-password/${token}`;
  const mailOptions = {
    from: 'your_email@example.com',
    to: email,
    subject: 'Password reset',
    html: `Please click <a href="${resetLink}">here</a> to reset your password.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info('Email sent: ' + info.response);
    }
  });
};

export default sendResetEmail;
