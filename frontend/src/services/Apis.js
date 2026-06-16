import Axios from 'axios';

const url = 'http://localhost:3000';

export const obtenerProductos = () => {  
  return Axios.get(`${url}/productos`);
};

