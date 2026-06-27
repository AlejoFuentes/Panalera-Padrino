import { useState, useEffect } from 'react';
import './Pañalera.css';
import BotonFlotanteWSP from '../estructura/BotonFlotanteWSP.jsx';
import Producto from '../panel/Producto.jsx'; 
import { obtenerProductos } from '../../services/Apis';
import { borrarTildes } from '../../services/utils.js';

const Pañalera = () => {
    
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        setLoading(true);
        obtenerProductos()
            .then(response => {
                setProductos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar el catálogo:', error);
                setLoading(false);
            });
    }, []);

    const productosFiltrados = productos.filter(p => 
        borrarTildes(p.nombre.toLowerCase()).includes(borrarTildes(busqueda.toLowerCase()))
    );

    return (
        <div className='contenedor-panalera'>
            <div className='container pt-5 pb-5'>
                <h1 className=' mb-5 fw-bold' style={{opacity: 0.8, color: "#10198f"}}>
                    ¡BIENVENIDO/A A DIS. TULIN!
                </h1>
                <h2 className='text-center mb-4 fw-bold text-dark' style={{opacity: 0.8}}>
                    Descubrí nuestros productos:
                </h2>
                <div className='contenedor-filtros-panel justify-content-center shadow-sm w-100'>
                    <div className='buscador-prod'>
                        <input 
                            className='form-control bg-light'
                            placeholder='Buscar producto...'
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        <i 
                            className='icono-buscador bi bi-search me-2'
                            alt="Buscar" 
                        />
                    </div>
                </div>
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
                        <div className='alert alert-light text-center w-100 shadow-sm'>No hay productos disponibles por el momento.</div>
                    )}
                </ul>
            </div>
            
            <BotonFlotanteWSP/>
        </div>
    )
}

export default Pañalera;