class ProductoController {
  
  constructor(pool, tokenController) {
    this.pool = pool;
    this.tokenController = tokenController;
  }

  obtenerProductos = async (req, res) => {
    try {
      const consulta = await this.pool.query('SELECT * FROM productos ORDER BY creado_en DESC');
      res.json(consulta.rows);
    } catch (error) {
      console.error('Error al cargar la mercadería:', error);
      res.status(500).json({ error: 'Error del servidor al intentar traer el inventario' });
    }
  };

  obtenerProductoPorId = async (req, res) => {
    try {
      const { id } = req.params;
      const consulta = await this.pool.query('SELECT * FROM productos WHERE id = $1', [id]);
      
      if (consulta.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      res.json(consulta.rows[0]);
    } catch (error) {
      console.error('Error al buscar el producto:', error);
      res.status(500).json({ error: 'Error del servidor al intentar traer el producto' });
    }
  };

  obtenerProductosPorMarca = async (req, res) => {
    try {
      const { marcaId } = req.params;
      const consulta = await this.pool.query('SELECT * FROM productos WHERE marca_id = $1 ORDER BY creado_en DESC', [marcaId]);
      res.json(consulta.rows);
    } catch (error) {
      console.error('Error al filtrar por marca:', error);
      res.status(500).json({ error: 'Error del servidor al filtrar por marca' });
    }
  };

  obtenerProductosPorCategoria = async (req, res) => {
    try {
      const { categoriaId } = req.params;
      const consulta = await this.pool.query('SELECT * FROM productos WHERE categoria_id = $1 ORDER BY creado_en DESC', [categoriaId]);
      res.json(consulta.rows);
    } catch (error) {
      console.error('Error al filtrar por categoría:', error);
      res.status(500).json({ error: 'Error del servidor al filtrar por categoría' });
    }
  };

  crearProducto = async (req, res) => {
    try {
      const { nombre, descripcion, precio, stock, marca_id, categoria_id } = req.body;

      const consulta = await this.pool.query(
        `INSERT INTO productos (nombre, descripcion, precio, stock, marca_id, categoria_id) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [nombre, descripcion, precio, stock, marca_id, categoria_id]
      );

      res.status(201).json(consulta.rows[0]);
    } catch (error) {
      console.error('Error al crear el producto:', error);
      res.status(500).json({ error: 'Error del servidor al crear el producto' });
    }
  };

  editarProducto = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, stock, marca_id, categoria_id } = req.body;

      const consulta = await this.pool.query(
        `UPDATE productos 
         SET nombre = $1, descripcion = $2, precio = $3, stock = $4, marca_id = $5, categoria_id = $6 
         WHERE id = $7 RETURNING *`,
        [nombre, descripcion, precio, stock, marca_id, categoria_id, id]
      );

      if (consulta.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado para editar' });
      }

      res.json(consulta.rows[0]);
    } catch (error) {
      console.error('Error al editar el producto:', error);
      res.status(500).json({ error: 'Error del servidor al editar el producto' });
    }
  };

  eliminarProducto = async (req, res) => {
    try {
      const { id } = req.params;
      
      const consulta = await this.pool.query(
        'DELETE FROM productos WHERE id = $1 RETURNING *', 
        [id]
      );

      if (consulta.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
      }

      // Devolvemos el producto eliminado por si el frontend lo necesita para mostrar un mensaje
      res.json({ mensaje: 'Producto eliminado exitosamente', producto: consulta.rows[0] });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).json({ error: 'Error del servidor al eliminar el producto' });
    }
  };

}

export default ProductoController;