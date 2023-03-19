import { Router } from 'express';
import validate from '../../middleware/validate';
import {
  forgotPasswordSchema,
  resetPasswordSchema
} from '../../validations/password.validation';
import * as passwordController from '../../controller/forgotPassword.controller';

const passwordRouter = Router();

passwordRouter.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  passwordController.handleForgotPassword
);
passwordRouter.post(
  '/reset-password/:token',
  validate(resetPasswordSchema),
  passwordController.handleResetPassword
);

export default passwordRouter;
