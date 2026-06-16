import { useState, useEffect } from 'react';
import { obtenerProductos } from '../../services/Apis';
import './AbmProductos.css'

const AbmProductos = () => {

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        obtenerProductos()
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.error('Error al obtener productos:', error);
            });
    }, []);

    return (
        <div className='container-admin'> 
            <h2 className='text-center mt-5'>  
                Panel de administración de productos de Distribuidora Tulin.
            </h2>
            <h6 className='text-center text-secondary'>  
                Aquí podrás gestionar la creación, modificación y eliminación de productos.
            </h6>
            <ul className="list-group gap-3 mb-5">
                {productos && productos.length > 0 ? (
                    productos.map(p => (
                    <li className="list-group-item d-flex row mx-5 p-4 rounded-3" key={p.id} >
                        <h5>{p.nombre}</h5>
                        <p>{p.descripcion}</p>
                        <p>Precio unitario: ${p.precio_unitario}</p>
                        <p>Precio mayorista: ${p.precio_mayorista}</p>
                    </li>
                ))
                ) : (
                    <div className='list-group-item text-center text-secondary mx-3'>No hay productos disponibles en el inventario.</div>
                )}
                    
            </ul>
        </div>
    )
}

export default AbmProductos;