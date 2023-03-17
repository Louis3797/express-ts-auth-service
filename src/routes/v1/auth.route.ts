import { Router } from 'express';
// import isAuth from '../../middleware/isAuth';
import * as authController from '../../controller/auth.controller';

const authRouter = Router();

authRouter.post('/signup', authController.handleSingUp);

authRouter.post('/login', authController.handleLogin);

authRouter.post('/logout', authController.handleLogout);

authRouter.post('/refresh', authController.handleRefresh);

authRouter.post('/forgot-password', authController.handleForgotPassword);
authRouter.post('/reset-password/:token', authController.handleResetPassword);

// authRouter.post(
//   '/send-verification-email',
//   isAuth,
//   authController.sendVerificationEmail
// );
// authRouter.post('/verify-email', authController.verifyEmail);

export default authRouter;
