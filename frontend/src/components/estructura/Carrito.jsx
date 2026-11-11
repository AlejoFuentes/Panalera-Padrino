import './Carrito.css';
import { createPortal } from 'react-dom';
import { useCarrito } from '../../context/CarritoContext';
import { NUMERO_WHATSAPP } from '../../services/utils';

const Carrito = () => {

    const { items, cambiarCantidad, quitarProducto, vaciarCarrito, cantidadTotal } = useCarrito();

    const armarLinkWhatsapp = () => {
        const lista = items.map(i => `• ${i.cantidad} x ${i.producto.nombre}`).join('\n');
        const mensaje = `¡Hola! Quiero hacer el siguiente pedido:\n\n${lista}\n\n¿Me confirmás disponibilidad y precio? ¡Gracias!`;
        return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    };

    return (
        <>
            {/* <-- BOTÓN FLOTANTE DEL CARRITO --> */}
            {cantidadTotal > 0 && (
                <button
                    className="btn-carrito"
                    title="Ver mi pedido"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCarrito"
                >
                    <i className="bi bi-cart3"></i>
                    <span className="badge-carrito">{cantidadTotal}</span>
                </button>
            )}

            {/* <-- PANEL LATERAL DEL CARRITO --> */}
            {createPortal(
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasCarrito">
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title fw-bold">
                        <i className="bi bi-cart3 me-2"></i>Mi pedido
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>

                <div className="offcanvas-body d-flex flex-column">
                    {items.length > 0 ? (
                        <>
                            <ul className="list-group list-group-flush flex-grow-1 overflow-auto">
                                {items.map(({ producto, cantidad }) => (
                                    <li key={producto.id} className="list-group-item d-flex align-items-center gap-2 px-0">
                                        <img src={producto.imagen} alt={producto.nombre} className="img-item-carrito" />
                                        <span className="flex-grow-1 small fw-medium">{producto.nombre}</span>
                                        <div className="input-group input-group-sm contador-carrito">
                                            <button className="btn btn-outline-secondary" onClick={() => cambiarCantidad(producto.id, cantidad - 1)}>−</button>
                                            <span className="input-group-text bg-white">{cantidad}</span>
                                            <button className="btn btn-outline-secondary" onClick={() => cambiarCantidad(producto.id, cantidad + 1)}>+</button>
                                        </div>
                                        <button className="btn btn-sm text-danger p-1" title="Quitar" onClick={() => quitarProducto(producto.id)}>
                                            <i className="bi bi-trash3-fill"></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-3 border-top d-flex flex-column gap-2">
                                <a
                                    href={armarLinkWhatsapp()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success fw-bold d-flex justify-content-center align-items-center gap-2"
                                >
                                    <i className="bi bi-whatsapp"></i> COMPRAR
                                </a>
                                <button className="btn btn-link text-secondary btn-sm" onClick={vaciarCarrito}>
                                    Vaciar pedido
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-secondary my-auto">
                            <i className="bi bi-cart-x fs-1 d-block mb-2"></i>
                            Todavía no agregaste productos.
                        </div>
                    )}
                </div>
            </div>,
            document.body
            )}
        </>
    );
};

export default Carrito;
