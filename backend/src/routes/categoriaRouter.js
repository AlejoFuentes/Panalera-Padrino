import express from 'express';

export const categoriaRouter = (categoriaController, tokenController) => {
    const router = express.Router();
    
    router.get('/', categoriaController.obtenerCategorias);
    router.post('/', categoriaController.crearCategoria);
    router.put('/:id', categoriaController.editarCategoria);
    router.delete('/', categoriaController.eliminarCategoria);
    
    return router;
}