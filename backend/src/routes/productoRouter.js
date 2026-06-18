import express from 'express';
import multer from 'multer';
import path from 'path';

// multer maneja la subida de archivos (imágenes), almacenandolas en /public/images del front.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prod-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export const productoRouter = (productoController, tokenController) => {
    const productoRouter = express.Router();
    
    productoRouter.get('/', productoController.obtenerProductos);
    productoRouter.get('/:id', productoController.obtenerProductoPorId);
    productoRouter.get('/marca/:marcaId', productoController.obtenerProductosPorMarca);
    productoRouter.get('/categoria/:categoriaId', productoController.obtenerProductosPorCategoria);
    
    productoRouter.post('/', upload.single('imagen'), productoController.crearProducto);
    productoRouter.put('/:id', upload.single('imagen'), productoController.editarProducto);
    
    productoRouter.delete('/', productoController.eliminarProducto);
    
    return productoRouter;
}