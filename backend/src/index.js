import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pool from '../db.js';

import ProductoController from './controllers/productoController.js';
import CategoriaController from './controllers/categoriaController.js';
import AuthController from './controllers/authController.js';
import { productoRouter } from './routes/productoRouter.js';
import { categoriaRouter } from './routes/categoriaRouter.js';
import { authRouter } from './routes/authRouter.js';

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

const productoController = new ProductoController(pool);
const categoriaController = new CategoriaController(pool);
const authController = new AuthController(pool);

app.use('/productos', productoRouter(productoController));
app.use('/categorias', categoriaRouter(categoriaController));
app.use('/auth', authRouter(authController));

app.listen(port, () => {
  console.log(`Servidor corriendo lo más bien en http://localhost:${port}`);
});
