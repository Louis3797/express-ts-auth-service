import { Router } from 'express';
// import isAuth from '../../middleware/isAuth';
import * as authController from '../../controller/auth.controller';
// import jwt from 'jsonwebtoken';

// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// const { sign } = jwt;

const authRouter = Router();

authRouter.post('/signup', authController.handleSingUp);

authRouter.post('/login', authController.handleLogin);

authRouter.post('/logout', authController.handleLogout);

authRouter.post('/refresh', authController.handleRefresh);

// authRouter.post('/forgot-password', authController.forgotPassword);
// authRouter.post('/reset-password', authController.resetPassword);
// authRouter.post(
//   '/send-verification-email',
//   isAuth,
//   authController.sendVerificationEmail
// );
// authRouter.post('/verify-email', authController.verifyEmail);

export default authRouter;
