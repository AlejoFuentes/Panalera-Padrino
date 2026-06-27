import { useState, useEffect } from 'react';
import { obtenerProductos, editarProducto, eliminarProducto,
         obtenerCategorias, agregarProducto, agregarCategoria,
         editarCategoria, eliminarCategoria } from '../../services/Apis';
import './AbmProductos.css'
import { formatearMoneda, borrarTildes } from '../../services/utils';
import Producto from './Producto'; 

const AbmProductos = () => {

    const [productos, setProductos] = useState([]);
    const [idProductoActual, setIdProductoActual] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoriaForm, setCategoriaForm] = useState({ id: null, nombre: '', orden: '' });

    const [productoNuevo, setProductoNuevo] = useState({
        nombre: '', descripcion: '', precio_unitario: '', precio_mayorista: '', imagen: null, categoria_id: ''
    });
    const [productoEditado, setProductoEditado] = useState({
        nombre: '', descripcion: '', precio_unitario: '', precio_mayorista: '', imagen: null, categoria_id: ''
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
        obtenerCategorias()
            .then(response => setCategorias(response.data))
            .catch(error => console.error('Error al obtener categorias:', error));
    }, []);

    const handleCrearProducto = (e) => {
        e.preventDefault();

        agregarProducto(
            productoNuevo.nombre,
            productoNuevo.descripcion,
            productoNuevo.precio_unitario,
            productoNuevo.precio_mayorista,
            productoNuevo.categoria_id,
            productoNuevo.imagen
        )
            .then(response => {
                const categoriaEncontrada = categorias.find(c => c.id === Number(response.data.categoria_id));
                const productoCreado = {
                    ...response.data,
                    categoria_nombre: categoriaEncontrada ? categoriaEncontrada.nombre : '- -'
                };
                setProductos([productoCreado, ...productos]);
                
                document.getElementById('btnCerrarModalAgregar').click();
                setProductoNuevo({
                    nombre: '', descripcion: '', precio_unitario: '', precio_mayorista: '', imagen: null, categoria_id: ''
                });
            })
            .catch(error => {
                console.error('Error al crear el producto:', error);
            });
    };

    const handleGuardarEdicion = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', productoEditado.nombre);
        formData.append('descripcion', productoEditado.descripcion);
        formData.append('precio_unitario', productoEditado.precio_unitario);
        formData.append('precio_mayorista', productoEditado.precio_mayorista);
        formData.append('categoria_id', productoEditado.categoria_id);

        if (productoEditado.imagen) {
            formData.append('imagen', productoEditado.imagen);
        }

        editarProducto(idProductoActual, formData)
            .then(response => {
                const categoriaEncontrada = categorias.find(c => c.id === Number(response.data.categoria_id));
                
                const productoActualizado = {
                    ...response.data,
                    categoria_nombre: categoriaEncontrada ? categoriaEncontrada.nombre : '- -'
                };
                setProductos(productos.map(producto => 
                    producto.id === idProductoActual ? productoActualizado : producto
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

    const handleGuardarCategoria = (e) => {
        e.preventDefault();

        if (categoriaForm.id) {
            editarCategoria(categoriaForm.id, categoriaForm.nombre, categoriaForm.orden)
                .then(response => {
                    const listaActualizada = categorias.map(c => c.id === categoriaForm.id ? response.data : c);
                    setCategorias(listaActualizada.sort((a, b) => a.orden - b.orden));
                    
                    setProductos(productos.map(producto => 
                        producto.categoria_id === categoriaForm.id 
                            ? { ...producto, categoria_nombre: response.data.nombre } 
                            : producto
                    ));

                    setCategoriaForm({ id: null, nombre: '', orden: '' }); 
                })
                .catch(error => console.error('Error al editar categoría:', error));
        } else {
            agregarCategoria(categoriaForm.nombre, categoriaForm.orden)
                .then(response => {
                    const listaActualizada = [...categorias, response.data];
                    setCategorias(listaActualizada.sort((a, b) => a.orden - b.orden));
                    setCategoriaForm({ id: null, nombre: '', orden: '' }); 
                })
                .catch(error => console.error('Error al crear categoría:', error));
        }
    };

    const handleEliminarCategoria = (id) => {
        if(window.confirm('¿Estás seguro de que querés eliminar esta categoría?')) {
            eliminarCategoria(id)
                .then(() => {
                    setCategorias(categorias.filter(c => c.id !== id));
                })
                .catch(error => {
                    if(error.response && error.response.status === 400) {
                        alert(error.response.data.error); 
                    } else {
                        console.error('Error al eliminar categoría:', error);
                    }
                });
        }
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
                <div className='d-flex gap-2'>
                    <button 
                        className='btn btn-secondary'
                        data-bs-toggle="modal" 
                        data-bs-target="#modalGestionarCategorias"
                        >
                        Gestionar categorías
                    </button>
                    <button 
                        className='btn btn-primary'
                        data-bs-toggle="modal" 
                        data-bs-target="#modalAgregarProducto"
                    >
                        Agregar Producto
                    </button>
                </div>
            </div>
            <ul className="contenedor-lista-productos list-group flex-row flex-wrap justify-content-center gap-3 mb-5">
                {loading ? (
                    <div className='h-100 d-flex justify-content-center align-items-center'>
                        <div className='spinner-border text-primary m-5' role='status'></div>
                    </div>
                ) : productosFiltrados && productosFiltrados.length > 0 ? (
                    productosFiltrados.map(p => (
                        <Producto 
                            key={p.id}
                            producto={p}
                            esAdmin={true} 
                            onEdit={(prod) => {
                                setIdProductoActual(prod.id); 
                                setProductoEditado({
                                    nombre: prod.nombre,
                                    descripcion: prod.descripcion,
                                    precio_unitario: prod.precio_unitario,
                                    precio_mayorista: prod.precio_mayorista,
                                    imagen: prod.imagen,
                                    categoria_id: prod.categoria_id
                                });
                            }}
                            onDelete={(id) => setIdProductoActual(id)}
                        />
                    ))
                ) : (
                    <div className='list-group-item text-center text-secondary mx-3'>No hay productos disponibles en el inventario.</div>
                )}
                    
            </ul>  

            {/* <-- Modal Agregar Producto --> */}
            <div className="modal fade" id="modalAgregarProducto" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content p-2">
                    <div className="modal-header border-0 pb-0">
                      <h5 className="modal-title fw-bold">Agregar Nuevo Producto</h5>
                      <button type="button" className="btn-close d-none" data-bs-dismiss="modal" id="btnCerrarModalAgregar"></button>
                    </div>

                    <div className="modal-body border-0 pt-2 pb-2">
                      <form onSubmit={handleCrearProducto}>
                          <div className="mb-3">
                              <label className="form-label">Nombre del producto</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={productoNuevo.nombre} 
                                onChange={e => setProductoNuevo({...productoNuevo, nombre: e.target.value})} 
                                required
                              />
                          </div>
                          <div className="mb-3">
                              <label className="form-label">Descripción</label>
                              <textarea 
                                className="form-control" 
                                value={productoNuevo.descripcion} 
                                onChange={e => setProductoNuevo({...productoNuevo, descripcion: e.target.value})} 
                                required
                              />
                          </div>
                          <div className="mb-3">
                              <label className="form-label">Categoría</label>
                              <select 
                                  className="form-select" 
                                  value={productoNuevo.categoria_id} 
                                  onChange={e => setProductoNuevo({...productoNuevo, categoria_id: e.target.value})}
                                  required
                              >
                                  <option value="">Seleccioná una categoría...</option>
                                  {categorias.map(cat => (
                                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                  ))}
                              </select>
                          </div>
                          <div className="row mb-3">
                              <div className="col">
                                  <label className="form-label">Precio Unitario</label>
                                  <input 
                                    type="number" 
                                    className="form-control" 
                                    value={productoNuevo.precio_unitario} 
                                    onChange={e => setProductoNuevo({...productoNuevo, precio_unitario: e.target.value})} 
                                    required
                                  />
                              </div>
                              <div className="col">
                                  <label className="form-label">Precio Mayorista</label>
                                  <input 
                                    type="number" 
                                    className="form-control" 
                                    value={productoNuevo.precio_mayorista} 
                                    onChange={e => setProductoNuevo({...productoNuevo, precio_mayorista: e.target.value})} 
                                    required
                                  />
                              </div>
                          </div>
                          <div className="mb-4">
                              <label className="form-label">Imagen</label>
                              <input 
                                type="file" 
                                className="form-control" 
                                accept="image/*" 
                                onChange={e => setProductoNuevo({...productoNuevo, imagen: e.target.files[0]})} 
                                required
                              />
                          </div>

                          <div className="d-flex justify-content-end gap-2">
                              <button type="button" className="btn btn-link text-white bg-secondary text-decoration-none" data-bs-dismiss="modal">Cancelar</button>
                              <button type="submit" className="boton-formulario btn bg-primary text-white px-4 rounded-3">Crear producto</button>
                          </div>
                      </form>
                    </div>
                  </div>
                </div>
            </div>

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
                          <div className="mb-3">
                              <label className="form-label">Categoría</label>
                              <select 
                                  className="form-select" 
                                  value={productoEditado.categoria_id || ''} 
                                  onChange={e => setProductoEditado({...productoEditado, categoria_id: e.target.value})}
                                  required
                              >
                                  <option value="">Seleccioná una categoría...</option>
                                  {categorias.map(cat => (
                                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                  ))}
                              </select>
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

            {/* <-- Modal Gestionar Categorías --> */}
            <div className="modal fade" id="modalGestionarCategorias" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content p-2">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold">Gestionar Categorías</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body border-0 pt-3 pb-4">
                            
                            {/* Formulario Superior para Agregar/Editar */}
                            <form onSubmit={handleGuardarCategoria} className="d-flex gap-2 align-items-end mb-4 bg-light p-3 rounded-3 shadow-sm">
                                <div className="flex-grow-1">
                                    <label className="form-label text-secondary mb-1" style={{fontSize: '0.9rem'}}>Nombre de categoría</label>
                                    <input type="text" className="form-control" value={categoriaForm.nombre} onChange={e => setCategoriaForm({...categoriaForm, nombre: e.target.value})} required />
                                </div>
                                <div style={{width: '100px'}}>
                                    <label className="form-label text-secondary mb-1" style={{fontSize: '0.9rem'}}>N° Orden</label>
                                    <input type="number" className="form-control" value={categoriaForm.orden} onChange={e => setCategoriaForm({...categoriaForm, orden: e.target.value})} required />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className={`btn ${categoriaForm.id ? 'btn-success' : 'btn-primary'}`}>
                                        {categoriaForm.id ? 'Actualizar' : 'Agregar'}
                                    </button>
                                    {categoriaForm.id && (
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setCategoriaForm({ id: null, nombre: '', orden: '' })}>
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Lista Inferior */}
                            <h6 className="fw-bold mb-3">Categorías existentes</h6>
                            <ul className="list-group shadow-sm">
                                {categorias && categorias.length > 0 ? categorias.map(c => (
                                    <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="badge bg-secondary me-3">Orden: {c.orden}</span>
                                            <span className="fw-medium fs-5">{c.nombre}</span>
                                        </div>
                                        <div>
                                            <button 
                                                className="btn btn-sm me-2 text-primary" 
                                                onClick={() => setCategoriaForm(c)}
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil-square fs-5"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm text-danger" 
                                                onClick={() => handleEliminarCategoria(c.id)}
                                                title="Eliminar"
                                            >
                                                <i className="bi bi-trash3-fill fs-5"></i>
                                            </button>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="list-group-item text-center text-secondary">No hay categorías creadas.</li>
                                )}
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AbmProductos;