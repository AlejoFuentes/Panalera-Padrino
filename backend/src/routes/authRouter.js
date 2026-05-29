import express from 'express';

export const authRouter = (authController) => {
    const authRouter = express.Router();
    authRouter.post('/login', authController.login);
    return authRouter;
}