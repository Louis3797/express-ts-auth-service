import { Router } from 'express';
import * as authController from '../../controller/auth.controller';

const authRouter = Router();

authRouter.post('/signup', authController.handleSingUp);

authRouter.post('/login', authController.handleLogin);

authRouter.post('/logout', authController.handleLogout);

authRouter.post('/refresh', authController.handleRefresh);

export default authRouter;
