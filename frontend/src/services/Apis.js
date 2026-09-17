import Axios from 'axios';

const url = 'http://localhost:3000';

const api = Axios.create({
    baseURL: url
});

// ==========================================
//           ENDPOINTS DE PRODUCTOS
// ==========================================

export const obtenerProductos = () => {  
  return api.get('/productos');
};

export const agregarProducto = (nombre, descripcion, precio_unitario, precio_mayorista, categoria_id, imagen) => {
    const formData = new FormData();
    
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio_unitario', precio_unitario);
    formData.append('precio_mayorista', precio_mayorista);
    formData.append('categoria_id', categoria_id);

    if (imagen) {
        formData.append('imagen', imagen);
    }

    return api.post('/productos', formData);
}

export const editarProducto = (id, formData) => {
    return api.put(`/productos/${id}`, formData);
};

export const eliminarProducto = (id) => {
  return api.delete('/productos', { data: { id } });
};

// ==========================================
//          ENDPOINTS DE CATEGORÍAS
// ==========================================

export const obtenerCategorias = () => {
  return api.get('/categorias');
};

export const agregarCategoria = (nombre, orden) => {
  return api.post('/categorias', { nombre, orden });
};

export const editarCategoria = (id, nombre, orden) => {
  return api.put(`/categorias/${id}`, { nombre, orden });
};

export const eliminarCategoria = (id) => {
  return api.delete('/categorias', { data: { id } });
};