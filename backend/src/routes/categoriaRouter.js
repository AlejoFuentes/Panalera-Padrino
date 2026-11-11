import express from 'express';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validarEsquema } from '../middlewares/validateMiddleware.js';
import { categoriaSchema } from '../schemas/categoriaSchemas.js';

export const categoriaRouter = (categoriaController) => {
    const router = express.Router();

    // Pública (la usa el catálogo)
    router.get('/', categoriaController.obtenerCategorias);

    // Solo administradores logueados
    router.post('/', verificarToken, validarEsquema(categoriaSchema), categoriaController.crearCategoria);
    router.put('/:id', verificarToken, validarEsquema(categoriaSchema), categoriaController.editarCategoria);
    router.delete('/', verificarToken, categoriaController.eliminarCategoria);

    return router;
}
