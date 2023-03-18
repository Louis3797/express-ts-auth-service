import { Router } from 'express';
import * as authController from '../../controller/auth.controller';

const verifyEmailRouter = Router();

verifyEmailRouter.post(
  '/send-verification-email',
  authController.sendVerificationEmail
);

verifyEmailRouter.post(
  '/verify-email/:token',
  authController.handleVerifyEmail
);

export default verifyEmailRouter;
