import logger from '../middleware/logger';
import transporter from '../config/nodemailer';

export const sendResetEmail = (email: string, token: string) => {
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
      logger.info('Reset password email sent: ' + info.response);
    }
  });
};

export const sendVerifyEmail = (email: string, token: string) => {
  const verifyLink = `https://example.com/verify-email/${token}`;
  const mailOptions = {
    from: 'your_email@example.com',
    to: email,
    subject: 'Email verification',
    html: `Please click <a href="${verifyLink}">here</a> to verify your email.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info('Verify email sent: ' + info.response);
    }
  });
};
