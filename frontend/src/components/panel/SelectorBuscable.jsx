import { useState } from 'react';
import { borrarTildes } from '../../services/utils';
import './SelectorBuscable.css';

// Desplegable con buscador. Recibe una lista de opciones con { id, nombre }.
// onChange devuelve la opción completa que se eligió.
const SelectorBuscable = ({ opciones, value, onChange, placeholder = 'Buscar...', required = false, small = false }) => {

    const [busqueda, setBusqueda] = useState('');
    const [abierta, setAbierta] = useState(false);

    const seleccionada = opciones.find(o => o.id === Number(value));

    const opcionesFiltradas = opciones.filter(o =>
        borrarTildes(o.nombre.toLowerCase()).includes(borrarTildes(busqueda.toLowerCase())) ||
        o.id.toString().includes(busqueda));

    const handleSeleccionar = (opcion) => {
        onChange(opcion);
        setAbierta(false);
    };

    return (
        <div className="position-relative">
            <input
                type="text"
                className={`form-control ${small ? 'form-control-sm' : ''}`}
                // Mientras se busca se muestra lo escrito; si no, el nombre de la opción elegida
                value={abierta ? busqueda : (seleccionada ? seleccionada.nombre : '')}
                placeholder={seleccionada ? seleccionada.nombre : placeholder}
                onChange={e => setBusqueda(e.target.value)}
                onFocus={() => { setBusqueda(''); setAbierta(true); }}
                onBlur={() => setAbierta(false)}
                onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }} // Evita enviar el form al buscar
                required={required}
            />
            <i className="icono-selector-buscable bi bi-chevron-down"></i>
            {abierta && (
                <ul className="lista-selector-buscable list-group position-absolute w-100 shadow">
                    {opcionesFiltradas.length > 0 ? opcionesFiltradas.map(o => (
                        <li
                            key={o.id}
                            className={`list-group-item list-group-item-action py-1 ${small ? 'small' : ''} ${seleccionada?.id === o.id ? 'active' : ''}`}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Evita que el input pierda el foco antes de seleccionar
                                handleSeleccionar(o);
                            }}
                        >
                            {o.nombre}
                        </li>
                    )) : (
                        <li className={`list-group-item py-1 text-secondary ${small ? 'small' : ''}`}>No se encontraron resultados.</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SelectorBuscable;
