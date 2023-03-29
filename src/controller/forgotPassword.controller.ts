import type { Response } from 'express';
import httpStatus from 'http-status';
import { randomUUID } from 'crypto';
import * as argon2 from 'argon2';
import prismaClient from '../config/prisma';
import type {
  EmailRequestBody,
  ResetPasswordRequestBodyType,
  TypedRequest
} from '../types/types';
import { sendResetEmail } from '../utils/sendEmail.util';

/**
 * Sends Forgot password email
 * @param req
 * @param res
 * @returns
 */
export const handleForgotPassword = async (
  req: TypedRequest<EmailRequestBody>,
  res: Response
) => {
  const { email } = req.body;

  // check req.body values
  if (!email) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Email is required!'
    });
  }

  // Check if the email exists in the database
  const user = await prismaClient.user.findUnique({ where: { email } });

  // check if email is verified
  if (!user || user.emailVerified) {
    return res.send(httpStatus.UNAUTHORIZED).json({
      message: 'Your email is not verified! Please confirm your email!'
    });
  }

  // Generate a reset token and save it to the database
  const resetToken = randomUUID();
  const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour
  await prismaClient.resetToken.create({
    data: {
      token: resetToken,
      expiresAt,
      userId: user.id
    }
  });

  // Send an email with the reset link
  sendResetEmail(email, resetToken);

  // Return a success message
  return res
    .status(httpStatus.OK)
    .json({ message: 'Password reset email sent' });
};

/**
 * Handles Password reset
 * @param req
 * @param res
 * @returns
 */
export const handleResetPassword = async (
  req: TypedRequest<ResetPasswordRequestBodyType>,
  res: Response
) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!token) return res.sendStatus(httpStatus.NOT_FOUND);

  if (!newPassword) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'New password is required!' });
  }

  // Check if the token exists in the database and is not expired
  const resetToken = await prismaClient.resetToken.findFirst({
    where: { token, expiresAt: { gt: new Date() } }
  });

  if (!resetToken) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ error: 'Invalid or expired token' });
  }

  // Update the user's password in the database
  const hashedPassword = await argon2.hash(newPassword);
  await prismaClient.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword }
  });

  // Delete the reset and all other reset tokens that the user owns from the database
  await prismaClient.resetToken.deleteMany({
    where: { userId: resetToken.userId }
  });

  // Delete also all refresh tokens
  await prismaClient.refreshToken.deleteMany({
    where: {
      userId: resetToken.userId
    }
  });

  // Return a success message
  return res
    .status(httpStatus.OK)
    .json({ message: 'Password reset successful' });
};
