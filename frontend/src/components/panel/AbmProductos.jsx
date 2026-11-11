import { useState, useEffect } from 'react';
import { obtenerProductos, editarProducto, eliminarProducto,
         obtenerCategorias, agregarProducto, agregarCategoria,
         editarCategoria, eliminarCategoria, aumentarPreciosPorCategoria } from '../../services/Apis';
import './AbmProductos.css'
import { formatearMoneda, borrarTildes } from '../../services/utils';
import Producto from './Producto';
import SelectorBuscable from './SelectorBuscable';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { mostrarExito, mostrarError, mostrarAdvertencia, confirmarAccion } from '../../services/toastify';

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

    // --- ESTADOS PARA EL REMITO ---
    const [clienteRemito, setClienteRemito] = useState('');
    const [itemsRemito, setItemsRemito] = useState([]);
    const [itemActual, setItemActual] = useState({
        cantidad: '',
        unidad: 'BULTOS',
        producto_id: '',
        precio: ''
    });

    // --- ESTADOS PARA EL AUMENTO DE PRECIOS ---
    const [aumentoForm, setAumentoForm] = useState({ categoria_id: '', porcentaje: '' });


    useEffect(() => {
        setLoading(true);
        obtenerProductos()
            .then(response => {
                setProductos(response.data);
                setLoading(false);
            })
            .catch(error => {
                mostrarError('Error al obtener los productos', error);
                setLoading(false);
            });
        obtenerCategorias()
            .then(response => setCategorias(response.data))
            .catch(error => mostrarError('Error al obtener las categorías', error));
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
                mostrarExito('Producto creado correctamente');
            })
            .catch(error => mostrarError('Error al crear el producto', error));
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
                mostrarExito('Producto editado correctamente');
            })
            .catch(error => mostrarError('Error al editar el producto', error));
    };

    const handleEliminarProducto = () => {
        eliminarProducto(idProductoActual)
            .then(response => {
                setProductos(productos.filter(producto => producto.id !== idProductoActual));
                setIdProductoActual(null);
                mostrarExito(response.data.mensaje);
            })
            .catch(error => mostrarError('Error al eliminar el producto', error));
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
                    mostrarExito('Categoría editada correctamente');
                })
                .catch(error => mostrarError('Error al editar la categoría', error));
        } else {
            agregarCategoria(categoriaForm.nombre, categoriaForm.orden)
                .then(response => {
                    const listaActualizada = [...categorias, response.data];
                    setCategorias(listaActualizada.sort((a, b) => a.orden - b.orden));
                    setCategoriaForm({ id: null, nombre: '', orden: '' });
                    mostrarExito('Categoría creada correctamente');
                })
                .catch(error => mostrarError('Error al crear la categoría', error));
        }
    };

    const handleEliminarCategoria = async (id) => {
        if (!(await confirmarAccion('¿Estás seguro de que querés eliminar esta categoría?', 'Eliminar'))) {
            return;
        }

        eliminarCategoria(id)
            .then(() => {
                setCategorias(categorias.filter(c => c.id !== id));
                mostrarExito('Categoría eliminada correctamente');
            })
            .catch(error => mostrarError('Error al eliminar la categoría', error));
    };

    // --- LÓGICA DEL AUMENTO DE PRECIOS ---
    const productosCategoriaAumento = productos.filter(p => p.categoria_id === Number(aumentoForm.categoria_id));

    const handleAumentarPrecios = async (e) => {
        e.preventDefault();

        const categoria = categorias.find(c => c.id === Number(aumentoForm.categoria_id));
        const mensaje = `¿Seguro que querés aplicar un ${aumentoForm.porcentaje}% a los ${productosCategoriaAumento.length} productos de "${categoria.nombre}"?`;
        if (!(await confirmarAccion(mensaje, 'Aplicar'))) {
            return;
        }

        aumentarPreciosPorCategoria(aumentoForm.categoria_id, aumentoForm.porcentaje)
            .then(response => {
                const actualizados = response.data.productos;
                setProductos(productos.map(producto => {
                    const actualizado = actualizados.find(a => a.id === producto.id);
                    return actualizado ? { ...actualizado, categoria_nombre: producto.categoria_nombre } : producto;
                }));
                mostrarExito(response.data.mensaje);
                document.getElementById('btnCerrarModalAumento').click();
                setAumentoForm({ categoria_id: '', porcentaje: '' });
            })
            .catch(error => mostrarError('Error al aumentar los precios', error));
    };

    const productosFiltrados = productos.filter(p =>
        borrarTildes(p.nombre.toLowerCase()).includes(borrarTildes(busqueda.toLowerCase())) || 
        borrarTildes(p.id.toString()).includes(borrarTildes(busqueda)));
    
    // --- LÓGICA DEL REMITO ---
    const handleSeleccionarProductoRemito = (prod) => {
        setItemActual({
            ...itemActual,
            producto_id: prod.id,
            precio: prod.precio_mayorista // Por defecto toma el mayorista, pero se puede editar
        });
    };

    const handleAgregarItemRemito = () => {
        if (!itemActual.cantidad || !itemActual.producto_id || !itemActual.precio) {
            mostrarAdvertencia('Completá la cantidad, el producto y el precio.');
            return;
        }
        const producto = productos.find(p => p.id === Number(itemActual.producto_id));
        const importe = Number(itemActual.cantidad) * Number(itemActual.precio);
        
        setItemsRemito([...itemsRemito, {
            cantidad_texto: `${itemActual.cantidad} ${itemActual.unidad}`,
            detalle: producto.nombre,
            precio: Number(itemActual.precio),
            importe: importe
        }]);
        
        setItemActual({ cantidad: '', unidad: 'BULTOS', producto_id: '', precio: '' });
    };

    const generarRemitoPDF = () => {
        if (!clienteRemito || itemsRemito.length === 0) {
            mostrarAdvertencia('Agregá un cliente y al menos un producto.');
            return;
        }

        const doc = new jsPDF();
        const fechaActual = new Date().toLocaleDateString('es-AR');

        // --- ENCABEZADO ESTILO EXCEL ---
        // Caja Distribuidora
        doc.setDrawColor(0);
        doc.setFillColor(240, 240, 240);
        doc.rect(14, 14, 90, 25, 'F');
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(31, 73, 125); // Azul oscuro
        doc.text("DISTRIBUIDORA TULIN", 59, 22, { align: "center" });
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text("Av. Nicolas videla Nº 3063 Begui / Antartida Arg Nº 3994 Begui", 16, 28);
        doc.text("11 2410-2875 / 11 5248-4930", 16, 33);

        // Caja Remito
        doc.setFillColor(217, 201, 186); // Marroncito claro
        doc.rect(104, 14, 92, 25, 'F');
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(31, 73, 125);
        doc.text("REMITO", 150, 22, { align: "center" });
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text("Documento no valido como factura", 150, 28, { align: "center" });
        doc.setFont("helvetica", "bold");
        doc.text(`Fecha ${fechaActual}`, 180, 37, { align: "right" });

        // Cuadro central "R"
        doc.setFillColor(220, 220, 220);
        doc.rect(97, 14, 14, 14, 'FD'); 
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(31, 73, 125);
        doc.text("R", 104, 25, { align: "center" });

        // Emails
        doc.setFontSize(9);
        doc.setTextColor(31, 73, 125);
        doc.text("togodofuentes@gmail.com", 59, 43, { align: "center" });
        doc.text("jacquelinebussinger@gmail.com", 59, 48, { align: "center" });

        // --- CLIENTE ---
        doc.setFillColor(220, 230, 242); // Celestito
        doc.rect(14, 53, 182, 8, 'F');
        doc.setFontSize(11);
        doc.setTextColor(31, 73, 125);
        doc.setFont("helvetica", "bold");
        doc.text(`SRES: ${clienteRemito.toUpperCase()}`, 16, 59);

        // --- TABLA DE PRODUCTOS ---
        const tableBody = itemsRemito.map(item => [
            item.cantidad_texto,
            item.detalle,
            `$ ${formatearMoneda(item.precio)}`,
            `$ ${formatearMoneda(item.importe)}`
        ]);

        const total = itemsRemito.reduce((acc, curr) => acc + curr.importe, 0);
        
        tableBody.push([
            { content: 'TOTAL', colSpan: 3, styles: { halign: 'right', fillColor: [155, 187, 89], textColor: [0,0,0], fontStyle: 'bold', fontSize: 12 } },
            { content: `$ ${formatearMoneda(total)}`, styles: { fillColor: [155, 187, 89], textColor: [0,0,0], fontStyle: 'bold', halign: 'right', fontSize: 11 } }
        ]);

        autoTable(doc, {
            startY: 61,
            head: [['Cantidad', 'Detalle', 'Precio', 'Importe']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [85, 142, 213], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
            styles: { fontSize: 9, cellPadding: 2, textColor: [0,0,0] },
            columnStyles: { 
                0: { cellWidth: 35 }, 
                1: { cellWidth: 'auto' }, 
                2: { cellWidth: 35, halign: 'right' }, 
                3: { cellWidth: 40, halign: 'right' } 
            }
        });

        doc.save(`Remito_${clienteRemito.replace(/\s+/g, '_')}_${fechaActual.replace(/\//g, '-')}.pdf`);
    };

    return (
        <div className='container-admin h-100'> 
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
                        className='btn btn-success'
                        data-bs-toggle="modal" 
                        data-bs-target="#modalDescargarRemito"
                    >
                        <i className='bi bi-file-earmark-pdf'></i>
                        <span className="d-none d-md-inline ms-2">Descargar Remito</span>
                    </button>
                    
                    <button
                        className='btn btn-danger'
                        data-bs-toggle="modal"
                        data-bs-target="#modalAumentarPrecios"
                    >
                        <i className='bi bi-graph-up-arrow'></i>
                        <span className="d-none d-md-inline ms-2">Aumentar precios</span>
                    </button>

                    <button
                        className='btn btn-secondary'
                        data-bs-toggle="modal"
                        data-bs-target="#modalGestionarCategorias"
                    >
                        <i className='bi bi-gear'></i>
                        <span className="d-none d-md-inline ms-2">Gestionar categorías</span>
                    </button>
                    
                    <button 
                        className='btn btn-primary'
                        data-bs-toggle="modal" 
                        data-bs-target="#modalAgregarProducto"
                    >
                        <i className='bi bi-plus-circle'></i>
                        <span className="d-none d-md-inline ms-2">Agregar Producto</span>
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
                      <h5 className="modal-title fw-bold border-bottom w-100 pb-2 mb-2">Nuevo Producto</h5>
                      <button type="button" className="btn-close d-none" data-bs-dismiss="modal" id="btnCerrarModalAgregar"></button>
                    </div>

                    <div className="modal-body border-0 pt-2 pb-2">
                      <form onSubmit={handleCrearProducto}>
                          <div className="mb-3">
                              <label className="form-label fw-bold">Nombre del producto</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={productoNuevo.nombre} 
                                onChange={e => setProductoNuevo({...productoNuevo, nombre: e.target.value})} 
                                required
                              />
                          </div>
                          <div className="mb-3">
                              <label className="form-label fw-bold">Descripción</label>
                              <textarea 
                                className="form-control" 
                                value={productoNuevo.descripcion} 
                                onChange={e => setProductoNuevo({...productoNuevo, descripcion: e.target.value})} 
                                required
                              />
                          </div>
                          <div className="mb-3">
                              <label className="form-label fw-bold">Categoría</label>
                              <SelectorBuscable
                                  opciones={categorias}
                                  value={productoNuevo.categoria_id}
                                  onChange={cat => setProductoNuevo({...productoNuevo, categoria_id: cat.id})}
                                  placeholder="Buscar categoría..."
                                  required
                              />
                          </div>
                          <div className="row mb-3">
                              <div className="col">
                                  <label className="form-label fw-bold">Precio Unitario</label>
                                  <input 
                                    type="number" 
                                    className="form-control" 
                                    value={productoNuevo.precio_unitario} 
                                    onChange={e => setProductoNuevo({...productoNuevo, precio_unitario: e.target.value})} 
                                    required
                                  />
                              </div>
                              <div className="col">
                                  <label className="form-label fw-bold">Precio Mayorista</label>
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
                              <label className="form-label fw-bold">Imagen</label>
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
                              <button type="submit" className="boton-formulario btn bg-primary text-white px-4 rounded-3">Agregar producto</button>
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
                    <div className="modal-header border-bottom pb-2 mb-1">
                      <h5 className="modal-title fw-bold">Editar Producto</h5>
                      <button type="button" className="btn-close d-none" data-bs-dismiss="modal" id="btnCerrarModalEdicion"></button>
                    </div>

                    <div className="modal-body border-0 pt-2 pb-2">
                      <form onSubmit={handleGuardarEdicion}>
                          <div className="mb-3">
                              <label className="form-label fw-bold">Nombre del producto</label>
                              <input type="text" className="form-control" value={productoEditado.nombre} onChange={e => setProductoEditado({...productoEditado, nombre: e.target.value})} required />
                          </div>
                          <div className="mb-3">
                              <label className="form-label fw-bold">Descripción</label>
                              <textarea className="form-control" value={productoEditado.descripcion} onChange={e => setProductoEditado({...productoEditado, descripcion: e.target.value})} required />
                          </div>
                          <div className="mb-3">
                              <label className="form-label fw-bold">Categoría</label>
                              <SelectorBuscable
                                  opciones={categorias}
                                  value={productoEditado.categoria_id}
                                  onChange={cat => setProductoEditado({...productoEditado, categoria_id: cat.id})}
                                  placeholder="Buscar categoría..."
                                  required
                              />
                          </div>
                          <div className="row mb-3">
                              <div className="col">
                                  <label className="form-label fw-bold">Precio Unitario</label>
                                  <input type="number" className="form-control" value={productoEditado.precio_unitario} onChange={e => setProductoEditado({...productoEditado, precio_unitario: e.target.value})} required />
                              </div>
                              <div className="col">
                                  <label className="form-label fw-bold">Precio Mayorista</label>
                                  <input type="number" className="form-control" value={productoEditado.precio_mayorista} onChange={e => setProductoEditado({...productoEditado, precio_mayorista: e.target.value})} required />
                              </div>
                          </div>
                          <div className="mb-4">
                              <label className="form-label fw-bold">Imagen</label>
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
                        Eliminar
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

            {/* <-- Modal Aumentar Precios --> */}
            <div className="modal fade" id="modalAumentarPrecios" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content p-2">
                    <div className="modal-header border-bottom pb-2 mb-1">
                      <h5 className="modal-title fw-bold">Aumentar precios por categoría</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" id="btnCerrarModalAumento"></button>
                    </div>

                    <div className="modal-body border-0 pt-2 pb-2">
                      <form onSubmit={handleAumentarPrecios}>
                          <div className="mb-3">
                              <label className="form-label fw-bold">Categoría</label>
                              <SelectorBuscable
                                  opciones={categorias}
                                  value={aumentoForm.categoria_id}
                                  onChange={cat => setAumentoForm({...aumentoForm, categoria_id: cat.id})}
                                  placeholder="Buscar categoría..."
                                  required
                              />
                          </div>
                          <div className="mb-3">
                              <label className="form-label fw-bold">Porcentaje de aumento</label>
                              <div className="input-group">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="-99.99"
                                    className="form-control"
                                    placeholder="Ej: 10"
                                    value={aumentoForm.porcentaje}
                                    onChange={e => setAumentoForm({...aumentoForm, porcentaje: e.target.value})}
                                    required
                                  />
                                  <span className="input-group-text">%</span>
                              </div>
                              <div className="form-text">Se aplica al precio unitario y al mayorista, redondeado a pesos enteros. Para bajar precios usá un número negativo.</div>
                          </div>

                          {aumentoForm.categoria_id && (
                              <div className="mb-4">
                                  <h6 className="fw-bold mb-2">Vista previa ({productosCategoriaAumento.length} productos)</h6>
                                  {productosCategoriaAumento.length > 0 ? (
                                      <div className="table-responsive" style={{maxHeight: '220px'}}>
                                          <table className="table table-sm table-bordered align-middle mb-0">
                                              <thead className="table-light">
                                                  <tr>
                                                      <th>Producto</th>
                                                      <th className="text-end">Unitario</th>
                                                      <th className="text-end">Mayorista</th>
                                                  </tr>
                                              </thead>
                                              <tbody>
                                                  {productosCategoriaAumento.map(p => {
                                                      const factor = 1 + (Number(aumentoForm.porcentaje) || 0) / 100;
                                                      return (
                                                          <tr key={p.id}>
                                                              <td className="small">{p.nombre}</td>
                                                              <td className="text-end small">
                                                                  ${formatearMoneda(p.precio_unitario)} → <b>${formatearMoneda(Math.round(p.precio_unitario * factor))}</b>
                                                              </td>
                                                              <td className="text-end small">
                                                                  ${formatearMoneda(p.precio_mayorista)} → <b>${formatearMoneda(Math.round(p.precio_mayorista * factor))}</b>
                                                              </td>
                                                          </tr>
                                                      );
                                                  })}
                                              </tbody>
                                          </table>
                                      </div>
                                  ) : (
                                      <div className="text-secondary small">No hay productos en esta categoría.</div>
                                  )}
                              </div>
                          )}

                          <div className="d-flex justify-content-end gap-2">
                              <button type="button" className="btn btn-link text-white bg-secondary text-decoration-none" data-bs-dismiss="modal">Cancelar</button>
                              <button type="submit" className="boton-formulario btn bg-danger text-white px-4 rounded-3" disabled={productosCategoriaAumento.length === 0}>Aplicar aumento</button>
                          </div>
                      </form>
                    </div>
                  </div>
                </div>
            </div>

            {/* <-- Modal Descargar Remito --> */}
            <div className="modal fade" id="modalDescargarRemito" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header border-bottom pb-2 mb-2">
                      <h5 className="modal-title fw-bold">Generar Remito PDF</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div className="modal-body border-0 pt-2 pb-2">
                        <div className="mb-4">
                            <label className="form-label fw-bold text-primary">Nombre del Cliente / Empresa</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Ej: LA PERLA"
                                value={clienteRemito} 
                                onChange={e => setClienteRemito(e.target.value)} 
                            />
                        </div>

                        <div className="card shadow-sm border-0 mb-4 bg-light">
                            <div className="card-body">
                                <h6 className="fw-bold mb-3">Agregar Productos</h6>
                                <div className="row g-2 align-items-end">
                                    <div className="col-md-2">
                                        <label className="form-label small fw-bold mb-1">Cant.</label>
                                        <input type="number" className="form-control form-control-sm" value={itemActual.cantidad} onChange={e => setItemActual({...itemActual, cantidad: e.target.value})} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label small fw-bold mb-1">Unidad</label>
                                        <select className="form-select form-select-sm" value={itemActual.unidad} onChange={e => setItemActual({...itemActual, unidad: e.target.value})}>
                                            <option value="BULTOS">BULTOS</option>
                                            <option value="UNIDADES">UNIDADES</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label small fw-bold mb-1">Producto</label>
                                        <SelectorBuscable
                                            opciones={productos}
                                            value={itemActual.producto_id}
                                            onChange={handleSeleccionarProductoRemito}
                                            placeholder="Buscar producto..."
                                            small
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label small fw-bold mb-1">Precio Unit.</label>
                                        <input type="number" className="form-control form-control-sm" value={itemActual.precio} onChange={e => setItemActual({...itemActual, precio: e.target.value})} />
                                    </div>
                                    <div className="col-md-2">
                                        <button type="button" className="btn btn-primary btn-sm w-100" onClick={handleAgregarItemRemito}>
                                            <i className="bi bi-plus-lg"></i> Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-sm table-bordered table-hover align-middle">
                                <thead className="table-dark text-center">
                                    <tr>
                                        <th>Cantidad</th>
                                        <th>Detalle</th>
                                        <th>Precio</th>
                                        <th>Importe</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsRemito.length > 0 ? itemsRemito.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="text-center">{item.cantidad_texto}</td>
                                            <td>{item.detalle}</td>
                                            <td className="text-end">${formatearMoneda(item.precio)}</td>
                                            <td className="text-end fw-bold">${formatearMoneda(item.importe)}</td>
                                            <td className="text-center">
                                                <button className="btn btn-sm text-danger p-0" onClick={() => setItemsRemito(itemsRemito.filter((_, i) => i !== idx))}>
                                                    <i className="bi bi-trash-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted py-3">Aún no hay productos agregados al remito.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" className="btn btn-success" onClick={generarRemitoPDF} disabled={itemsRemito.length === 0}>
                            <i className="bi bi-file-earmark-pdf me-2"></i>Generar y Descargar
                        </button>
                    </div>
                  </div>
                </div>
            </div>

        </div>
    )
}

export default AbmProductos;