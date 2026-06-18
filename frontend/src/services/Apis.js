import Axios from 'axios';

const url = 'http://localhost:3000';

export const obtenerProductos = () => {  
  return Axios.get(`${url}/productos`);
};

export const editarProducto = (id, formData) => {
    return Axios.put(`${url}/productos/${id}`, formData);
};

export const eliminarProducto = (id) => {
  return Axios.delete(`${url}/productos`, { data: { id } });
};