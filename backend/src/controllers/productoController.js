class ProductoController {
  
  constructor(pool, tokenController) {
    this.pool = pool;
    this.tokenController = tokenController;
  }

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

  obtenerProductos = async (req, res) => {
    try {
      const consulta = await this.pool.query(`
        SELECT p.*, c.nombre AS categoria_nombre 
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        ORDER BY p.creado_en DESC
      `);
      res.json(consulta.rows);
    } catch (error) {
      console.error('Error al cargar la mercadería:', error);
      res.status(500).json({ error: 'Error del servidor al intentar traer el inventario' });
    }
  };

  crearProducto = async (req, res) => {
    try {
      const { nombre, descripcion, precio_unitario, precio_mayorista, categoria_id } = req.body;

      let imagenUrl = null;
      if (req.file) {
          imagenUrl = `/images/${req.file.filename}`;
      }

      const consulta = await this.pool.query(
        `INSERT INTO productos (nombre, descripcion, precio_unitario, precio_mayorista, imagen, categoria_id) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [nombre, descripcion, precio_unitario, precio_mayorista, imagenUrl, categoria_id]
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
      const { nombre, descripcion, precio_unitario, precio_mayorista, categoria_id } = req.body;

      let consulta;

      if (req.file) {
        const imagenUrl = `/images/${req.file.filename}`;
        consulta = await this.pool.query(
          `UPDATE productos 
           SET nombre = $1, descripcion = $2, precio_unitario = $3, precio_mayorista = $4, imagen = $5, categoria_id = $6 
           WHERE id = $7 RETURNING *`,
          [nombre, descripcion, precio_unitario, precio_mayorista, imagenUrl, categoria_id, id]
        );
      } else {
        consulta = await this.pool.query(
          `UPDATE productos 
           SET nombre = $1, descripcion = $2, precio_unitario = $3, precio_mayorista = $4, categoria_id = $5 
           WHERE id = $6 RETURNING *`,
          [nombre, descripcion, precio_unitario, precio_mayorista, categoria_id, id]
        );
      }

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
      const { id } = req.body;
      
      const consulta = await this.pool.query(
        'DELETE FROM productos WHERE id = $1 RETURNING *', 
        [id]
      );

      if (consulta.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
      }
      res.json({ mensaje: 'Producto eliminado exitosamente', producto: consulta.rows[0] });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).json({ error: 'Error del servidor al eliminar el producto' });
    }
  };

}

export default ProductoController;