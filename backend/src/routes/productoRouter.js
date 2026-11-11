import express from 'express';
import multer from 'multer';
import path from 'path';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { validarEsquema } from '../middlewares/validateMiddleware.js';
import { productoSchema, aumentoPreciosSchema } from '../schemas/productoSchemas.js';

const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prod-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: function (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('image/') && EXTENSIONES_PERMITIDAS.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error('El archivo debe ser una imagen (jpg, png, webp o gif).'));
    }
  }
});

const subirImagen = (req, res, next) => {
  upload.single('imagen')(req, res, (error) => {
    if (error) {
      const mensaje = error.code === 'LIMIT_FILE_SIZE' ? 'La imagen no puede pesar más de 5 MB.' : error.message;
      return res.status(400).json({ error: mensaje });
    }
    next();
  });
};

export const productoRouter = (productoController) => {
    const productoRouter = express.Router();

    // Públicas (las usa el catálogo)
    productoRouter.get('/', productoController.obtenerProductos);
    productoRouter.get('/:id', productoController.obtenerProductoPorId);
    productoRouter.get('/marca/:marcaId', productoController.obtenerProductosPorMarca);
    productoRouter.get('/categoria/:categoriaId', productoController.obtenerProductosPorCategoria);

    // Solo administradores logueados.
    productoRouter.post('/', verificarToken, subirImagen, validarEsquema(productoSchema), productoController.crearProducto);
    productoRouter.put('/categoria/:categoriaId/aumento', verificarToken, validarEsquema(aumentoPreciosSchema), productoController.aumentarPreciosPorCategoria);
    productoRouter.put('/:id', verificarToken, subirImagen, validarEsquema(productoSchema), productoController.editarProducto);

    productoRouter.delete('/', verificarToken, productoController.eliminarProducto);
    
    return productoRouter;
}