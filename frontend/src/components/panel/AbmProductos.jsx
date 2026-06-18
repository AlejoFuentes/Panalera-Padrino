import { useState, useEffect } from 'react';
import { obtenerProductos, editarProducto, eliminarProducto } from '../../services/Apis';
import './AbmProductos.css'
import { formatearMoneda, borrarTildes } from '../../services/utils';

const AbmProductos = () => {

    const [productos, setProductos] = useState([]);
    const [idProductoActual, setIdProductoActual] = useState(null);
    const [productoEditado, setProductoEditado] = useState({
        nombre: '', descripcion: '', precio_unitario: '', precio_mayorista: '', imagen: null
    });
    const [busqueda, setBusqueda] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        obtenerProductos()
            .then(response => {
                setProductos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener productos:', error);
                setLoading(false);
            });
    }, []);

    const handleGuardarEdicion = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', productoEditado.nombre);
        formData.append('descripcion', productoEditado.descripcion);
        formData.append('precio_unitario', productoEditado.precio_unitario);
        formData.append('precio_mayorista', productoEditado.precio_mayorista);
        
        if (productoEditado.imagen) {
            formData.append('imagen', productoEditado.imagen);
        }

        editarProducto(idProductoActual, formData)
            .then(response => {
                setProductos(productos.map(producto => 
                    producto.id === idProductoActual ? response.data : producto
                ));
                document.getElementById('btnCerrarModalEdicion').click();
                setIdProductoActual(null);
            })
            .catch(error => {
                console.error('Error al editar el producto:', error);
            });
    };

    const handleEliminarProducto = () => {
        eliminarProducto(idProductoActual)
            .then(response => {
                console.log(response.data.mensaje);
                setProductos(productos.filter(producto => producto.id !== idProductoActual));
                setIdProductoActual(null);
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error);
            });
    };

    const productosFiltrados = productos.filter(p => 
        borrarTildes(p.nombre.toLowerCase()).includes(borrarTildes(busqueda.toLowerCase())) || 
        borrarTildes(p.id.toString()).includes(borrarTildes(busqueda)));

    return (
        <div className='container-admin'> 
            <h2 className='text-center pt-4'>  
                Panel de administración de productos de Distribuidora Tulin.
            </h2>
            <h6 className='text-center text-secondary mb-3'>  
                Aquí podrás gestionar la creación, modificación y eliminación de productos.
            </h6>
            <div className='contenedor-filtros-panel shadow-sm'>
                <div className='buscador-prod'>
                        <input 
                            className='form-control bg-light'
                            placeholder='Buscar por id o nombre del producto...'
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        <i 
                            className='icono-buscador bi bi-search me-2'
                            alt="Buscar" 
                        />
                    </div>
                <button className='btn btn-primary'>
                    Agregar Producto
                </button>
            </div>
            <ul className="list-group flex-row flex-wrap justify-content-center gap-3 mb-5">
                {loading ? (
                    <div className='h-100 d-flex justify-content-center align-items-center'>
                        <div className='spinner-border text-primary m-5' role='status'></div>
                    </div>
                ) : productosFiltrados && productosFiltrados.length > 0 ? (
                    productosFiltrados.map(p => (
                    <li className="producto-lista list-group-item col-4 rounded-3 shadow-sm" key={p.id}>
                        <div className='d-flex col-4 justify-content-center mb-3'>
                            <img src= {p.imagen} className='img-producto h-100 w-100'/>
                        </div>
                        <div className='col-8 d-flex flex-column justify-content-between p-2'>
                            <div>
                                <h5>{p.nombre}</h5>
                                <p className='form-text mb-2'>{p.descripcion}</p>
                            </div>     
                            <div className='d-flex justify-content-between align-items-end'>
                                <div>
                                    <strong className='detalles-producto'>Id producto: <span className='fw-normal'>{p.id}</span></strong> <br/>
                                    <strong className='detalles-producto'>Categoría: <span className='fw-normal'>pañales</span></strong> <br/>
                                    <strong className='detalles-producto'>Precio unitario: <span className="badge bg-primary">${formatearMoneda(p.precio_unitario)}</span></strong> <br/>
                                    <strong className='detalles-producto'>Precio mayorista: <span className="badge bg-success">${formatearMoneda(p.precio_mayorista)}</span></strong>
                                </div>
                                <div className='d-flex justify-content-end align-items-center'>
                                    <button 
                                        className='btn'
                                        data-bs-toggle="modal" 
                                        data-bs-target="#modalEditarProducto"
                                        onClick={() => {
                                            setIdProductoActual(p.id); 
                                            setProductoEditado({
                                                nombre: p.nombre,
                                                descripcion: p.descripcion,
                                                precio_unitario: p.precio_unitario,
                                                precio_mayorista: p.precio_mayorista,
                                                imagen: p.imagen
                                            })}}
                                    > 
                                        <i className='bi bi-pencil-square fs-4 m-0' style={{color: 'rgb(211, 35, 35)'}}></i>   
                                    </button>
                                    <button 
                                        className='btn'
                                        data-bs-toggle="modal" 
                                        data-bs-target="#modalEliminarProducto"
                                        onClick={() => setIdProductoActual(p.id)}
                                    >
                                        <i className='bi bi-trash3-fill fs-4 m-0' style={{color: 'rgb(211, 35, 35)'}}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))
                ) : (
                    <div className='list-group-item text-center text-secondary mx-3'>No hay productos disponibles en el inventario.</div>
                )}
                    
            </ul>
            {/* <-- Modal Editar Producto --> */}
            <div className="modal fade" id="modalEditarProducto" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content p-2">
                    <div className="modal-header border-0 pb-0">
                      <h5 className="modal-title fw-bold">Editar Producto</h5>
                      <button type="button" className="btn-close d-none" data-bs-dismiss="modal" id="btnCerrarModalEdicion"></button>
                    </div>

                    <div className="modal-body border-0 pt-2 pb-2">
                      <form onSubmit={handleGuardarEdicion}>
                          <div className="mb-3">
                              <label className="form-label">Nombre del producto</label>
                              <input type="text" className="form-control" value={productoEditado.nombre} onChange={e => setProductoEditado({...productoEditado, nombre: e.target.value})} required />
                          </div>
                          <div className="mb-3">
                              <label className="form-label">Descripción</label>
                              <textarea className="form-control" value={productoEditado.descripcion} onChange={e => setProductoEditado({...productoEditado, descripcion: e.target.value})} required />
                          </div>
                          <div className="row mb-3">
                              <div className="col">
                                  <label className="form-label">Precio Unitario</label>
                                  <input type="number" className="form-control" value={productoEditado.precio_unitario} onChange={e => setProductoEditado({...productoEditado, precio_unitario: e.target.value})} required />
                              </div>
                              <div className="col">
                                  <label className="form-label">Precio Mayorista</label>
                                  <input type="number" className="form-control" value={productoEditado.precio_mayorista} onChange={e => setProductoEditado({...productoEditado, precio_mayorista: e.target.value})} required />
                              </div>
                          </div>
                          <div className="mb-4">
                              <label className="form-label">Imagen (Opcional)</label>
                              {/* Al acceder a e.target.files[0] capturamos el archivo físico, no solo el nombre */}
                              <input type="file" className="form-control" accept="image/*" onChange={e => setProductoEditado({...productoEditado, imagen: e.target.files[0]})} />
                              <div className="form-text">Si no seleccionás nada, se conserva la foto actual.</div>
                          </div>

                          <div className="d-flex justify-content-end gap-2">
                              <button type="button" className="btn btn-link text-white bg-secondary text-decoration-none" data-bs-dismiss="modal">Cancelar</button>
                              <button type="submit" className="boton-formulario btn bg-primary text-white px-4 rounded-3">Guardar cambios</button>
                          </div>
                      </form>
                    </div>
                  </div>
                </div>
            </div>

            {/* <-- Modal Eliminar Producto --> */}
            <div className="modal fade" id="modalEliminarProducto" tabIndex="-1" aria-labelledby="modalEliminarProductoLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-2">

                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title fw-bold" id="modalEliminarProductoLabel">Eliminar Producto</h5>
                  </div>

                  <div className="modal-body border-0 pt-2 pb-4">
                    ¿Estás seguro que querés eliminar este producto?
                  </div>
                                    
                  <div className="modal-footer border-0">
                    <button 
                        type="button" 
                        className="btn btn-link text-white bg-secondary text-decoration-none" 
                        data-bs-dismiss="modal"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        className="boton-formulario btn bg-danger text-white px-4 rounded-3" 
                        onClick={handleEliminarProducto}
                        data-bs-dismiss="modal"
                    >
                        Borrar
                    </button>
                  </div>

                </div>
              </div>
            </div>
        </div>
    )
}

export default AbmProductos;