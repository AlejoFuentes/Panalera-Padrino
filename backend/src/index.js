import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from '../db.js';

import ProductoController from './controllers/productoController.js';
import TokenController from './controllers/tokenController.js';
import { productoRouter } from './routes/productoRouter.js';
import CategoriaController from './controllers/categoríaController.js';
import { categoriaRouter } from './routes/categoriaRouter.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const tokenController = new TokenController(pool);
const productoController = new ProductoController(pool, tokenController);
const categoriaController = new CategoriaController(pool, tokenController);

app.use('/productos', productoRouter(productoController, tokenController));
app.use('/categorias', categoriaRouter(categoriaController, tokenController));

app.listen(port, () => {
  console.log(`Servidor corriendo lo más bien en http://localhost:${port}`);
});