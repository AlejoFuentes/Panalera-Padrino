import { formatearMoneda } from '../../services/utils';

const Producto = ({ producto, esAdmin, onEdit, onDelete }) => {
    
    const numeroWhatsapp = '5491152484930'; 
    const mensajeWa = `¡Hola! Me interesa el producto: ${producto.nombre}`;
    const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensajeWa)}`;

    return (
        <li className="producto-lista list-group-item rounded-3 shadow-sm">
            <div className='d-flex col-4 justify-content-center align-items-center mb-3'>
                <img src={producto.imagen} className='img-producto' alt={producto.nombre} />
            </div>
            <div className='col-8 d-flex flex-column justify-content-between p-2'>
                <div>
                    <h5>{producto.nombre}</h5>
                    <p className='form-text mb-2'>{producto.descripcion}</p>
                </div>     
                <div className='d-flex justify-content-between align-items-end'>
                    <div>
                        {esAdmin && (
                            <strong className='detalles-producto'>Id producto: <span className='fw-normal'>{producto.id}</span> <br/></strong>
                        )}
                        <strong className='detalles-producto'>Categoría: <span className='fw-normal'>{producto.categoria_nombre}</span></strong> <br/>
                        <strong className='detalles-producto'>Precio unitario: <span className="badge bg-primary">${formatearMoneda(producto.precio_unitario)}</span></strong> <br/>
                        <strong className='detalles-producto'>Precio mayorista: <span className="badge bg-success">${formatearMoneda(producto.precio_mayorista)}</span></strong>
                    </div>
                    
                    <div className='d-flex justify-content-end align-items-center gap-2'>
                        {esAdmin ? (
                            <>
                                <button 
                                    className='btn'
                                    title='Editar producto'
                                    data-bs-toggle="modal" 
                                    data-bs-target="#modalEditarProducto"
                                    onClick={() => onEdit(producto)}
                                > 
                                    <i className='bi bi-pencil-square text-primary fs-4 m-0'></i>   
                                </button>
                                <button 
                                    className='btn'
                                    title='Eliminar producto'
                                    data-bs-toggle="modal" 
                                    data-bs-target="#modalEliminarProducto"
                                    onClick={() => onDelete(producto.id)}
                                >
                                    <i className='bi bi-trash3-fill fs-4 m-0' style={{color: 'rgb(211, 35, 35)'}}></i>
                                </button>
                            </>
                        ) : (
                            <a 
                                href={linkWhatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-success d-flex align-items-center gap-2"
                            >
                                <i className="bi bi-whatsapp"></i> Comprar
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default Producto;