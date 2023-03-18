import { Router } from 'express';
import * as authController from '../../controller/auth.controller';

const passwordRouter = Router();

passwordRouter.post('/forgot-password', authController.handleForgotPassword);
passwordRouter.post(
  '/reset-password/:token',
  authController.handleResetPassword
);

export default passwordRouter;
