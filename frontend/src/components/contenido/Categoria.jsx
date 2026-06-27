import { useState, useEffect } from 'react';
import { useParams } from 'react-router'; 
import './Categoria.css';
import BotonFlotanteWSP from '../estructura/BotonFlotanteWSP.jsx';
import Producto from '../panel/Producto.jsx';
import { obtenerProductos, obtenerCategorias } from '../../services/Apis';

const Categoria = () => {
    
    const { nombre } = useParams(); 
    
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        
        Promise.all([obtenerProductos(), obtenerCategorias()])
            .then(([resProductos, resCategorias]) => {
                
                const categoriaActual = resCategorias.data.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());
                setNombreCategoria(categoriaActual ? categoriaActual.nombre : 'Categoría');

                if(categoriaActual){
                    const filtrados = resProductos.data.filter(p => p.categoria_id === categoriaActual.id);
                    setProductosFiltrados(filtrados);
                } else {
                    setProductosFiltrados([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar datos:', error);
                setLoading(false);
            });
            
    }, [nombre]); 

    return (
        <div className='contenedor-panalera'> 
            <div className='container pt-5 pb-5'>
                
                <h2 className=' mb-5 fw-bold text-dark text-capitalize' style={{opacity: 0.8}}>
                    {'>'} {nombreCategoria}
                </h2>
                
                <ul className="list-group flex-row flex-wrap justify-content-center gap-3">
                    {loading ? (
                        <div className='d-flex justify-content-center align-items-center w-100' style={{height: '40vh'}}>
                            <div className='spinner-border text-primary' role='status' style={{width: '3rem', height: '3rem'}}></div>
                        </div>
                    ) : productosFiltrados.length > 0 ? (
                        productosFiltrados.map(p => (
                            <Producto 
                                key={p.id}
                                producto={p}
                                esAdmin={false} 
                            />
                        ))
                    ) : (
                        <div className='alert alert-light text-center w-100 shadow-sm'>
                            No hay productos disponibles en la categoría {nombreCategoria} por el momento.
                        </div>
                    )}
                </ul>
            </div>
            
            <BotonFlotanteWSP/>
        </div>
    )
}

export default Categoria;