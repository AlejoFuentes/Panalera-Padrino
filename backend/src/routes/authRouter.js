import express from 'express';
import rateLimit from 'express-rate-limit';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validarEsquema } from '../middlewares/validateMiddleware.js';
import { loginSchema } from '../schemas/authSchemas.js';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8,
    message: { error: 'Demasiados intentos de inicio de sesión. Por favor, intentá de nuevo en 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authRouter = (authController) => {
    const router = express.Router();

    router.post('/login', loginLimiter, validarEsquema(loginSchema), authController.login);
    router.get('/verificar', verificarToken, authController.verificarSesion);

    return router;
}
