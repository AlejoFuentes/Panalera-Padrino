import express from 'express';

export const productoRouter = (productoController, tokenController) => {
    const productoRouter = express.Router();
    
    productoRouter.get('/', productoController.obtenerProductos);
    productoRouter.get('/:id', productoController.obtenerProductoPorId);
    productoRouter.get('/marca/:marcaId', productoController.obtenerProductosPorMarca);
    productoRouter.get('/categoria/:categoriaId', productoController.obtenerProductosPorCategoria);
    
    return productoRouter;
}