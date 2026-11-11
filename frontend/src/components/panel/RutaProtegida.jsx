import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import { verificarSesion } from '../../services/Apis';

// Solo muestra el contenido si hay una sesión válida; si no, manda al login.
const RutaProtegida = ({ children }) => {

    const [estado, setEstado] = useState('verificando'); // 'verificando' | 'autorizado' | 'denegado'

    useEffect(() => {
        verificarSesion()
            .then(() => setEstado('autorizado'))
            .catch(() => setEstado('denegado'));
    }, []);

    if (estado === 'verificando') {
        return (
            <div className='vh-100 d-flex justify-content-center align-items-center'>
                <div className='spinner-border text-primary' role='status'></div>
            </div>
        );
    }

    return estado === 'autorizado' ? children : <Navigate to='/admin' replace />;
};

export default RutaProtegida;
