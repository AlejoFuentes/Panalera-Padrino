class CategoriaController {
  
    constructor(pool, tokenController) {
      this.pool = pool;
      this.tokenController = tokenController;
    }
  
    obtenerCategorias = async (req, res) => {
      try {
        const consulta = await this.pool.query('SELECT * FROM categorias ORDER BY orden ASC');
        res.json(consulta.rows);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error del servidor al intentar traer las categorías' });
      }
    };
  
    crearCategoria = async (req, res) => {
      try {
        const { nombre, orden } = req.body;
        const consulta = await this.pool.query(
          'INSERT INTO categorias (nombre, orden) VALUES ($1, $2) RETURNING *',
          [nombre, orden]
        );
        res.status(201).json(consulta.rows[0]);
      } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).json({ error: 'Error del servidor al crear la categoría' });
      }
    };
  
    editarCategoria = async (req, res) => {
      try {
        const { id } = req.params;
        const { nombre, orden } = req.body;
        
        const consulta = await this.pool.query(
          'UPDATE categorias SET nombre = $1, orden = $2 WHERE id = $3 RETURNING *',
          [nombre, orden, id]
        );
  
        if (consulta.rows.length === 0) {
          return res.status(404).json({ error: 'Categoría no encontrada para editar' });
        }
  
        res.json(consulta.rows[0]);
      } catch (error) {
        console.error('Error al editar la categoría:', error);
        res.status(500).json({ error: 'Error del servidor al editar la categoría' });
      }
    };
  
    eliminarCategoria = async (req, res) => {
      try {
        const { id } = req.body;
        
        const consulta = await this.pool.query(
          'DELETE FROM categorias WHERE id = $1 RETURNING *', 
          [id]
        );
  
        if (consulta.rows.length === 0) {
          return res.status(404).json({ error: 'Categoría no encontrada para eliminar' });
        }
        res.json({ mensaje: 'Categoría eliminada exitosamente', categoria: consulta.rows[0] });
        
      } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ error: 'No se puede borrar esta categoría porque tiene productos asociados. Cambiale la categoría a esos productos primero.' });
        }
        console.error('Error al eliminar la categoría:', error);
        res.status(500).json({ error: 'Error del servidor al intentar eliminar la categoría' });
      }
    };
}
  
export default CategoriaController;