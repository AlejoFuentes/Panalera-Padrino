import Axios from 'axios';

const url = 'http://localhost:3000';

// ==========================================
//           ENDPOINTS DE PRODUCTOS
// ==========================================

export const obtenerProductos = () => {  
  return Axios.get(`${url}/productos`);
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

    return Axios.post(`${url}/productos`, formData);
}

export const editarProducto = (id, formData) => {
    return Axios.put(`${url}/productos/${id}`, formData);
};

export const eliminarProducto = (id) => {
  return Axios.delete(`${url}/productos`, { data: { id } });
};

// ==========================================
//          ENDPOINTS DE CATEGORÍAS
// ==========================================

export const obtenerCategorias = () => {
  return Axios.get(`${url}/categorias`);
};

export const agregarCategoria = (nombre, orden) => {
  return Axios.post(`${url}/categorias`, { nombre, orden });
};

export const editarCategoria = (id, nombre, orden) => {
  return Axios.put(`${url}/categorias/${id}`, { nombre, orden });
};

export const eliminarCategoria = (id) => {
  return Axios.delete(`${url}/categorias`, { data: { id } });
};