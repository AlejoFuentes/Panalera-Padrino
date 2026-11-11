import { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

const CLAVE_STORAGE = 'carrito-tulin';

const cargarCarrito = () => {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
    } catch {
        return [];
    }
};

export const CarritoProvider = ({ children }) => {

    // Cada item es { producto, cantidad }
    const [items, setItems] = useState(cargarCarrito);

    useEffect(() => {
        try {
            localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items));
        } catch {
            console.error('Error al guardar el carrito en localStorage');
        }
    }, [items]);

    const agregarProducto = (producto) => {
        setItems(prev => prev.some(i => i.producto.id === producto.id)
            ? prev.map(i => i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i)
            : [...prev, { producto, cantidad: 1 }]
        );
    };

    const cambiarCantidad = (productoId, cantidad) => {
        setItems(prev => cantidad <= 0
            ? prev.filter(i => i.producto.id !== productoId)
            : prev.map(i => i.producto.id === productoId ? { ...i, cantidad } : i)
        );
    };

    const quitarProducto = (productoId) => {
        setItems(prev => prev.filter(i => i.producto.id !== productoId));
    };

    const vaciarCarrito = () => setItems([]);

    const obtenerCantidad = (productoId) => {
        const item = items.find(i => i.producto.id === productoId);
        return item ? item.cantidad : 0;
    };

    const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

    return (
        <CarritoContext.Provider value={{
            items, agregarProducto, cambiarCantidad, quitarProducto, vaciarCarrito, obtenerCantidad, cantidadTotal
        }}>
            {children}
        </CarritoContext.Provider>
    );
};

export const useCarrito = () => useContext(CarritoContext);
