import { createElement as h } from 'react';
import { toast } from 'react-toastify';

export const mostrarExito = (mensaje) => {
    toast.success(mensaje);
};

export const mostrarError = (mensaje, error = null) => {
    if (error) console.error(mensaje, error);
    toast.error(error?.response?.data?.error || mensaje);
};

export const mostrarAdvertencia = (mensaje) => {
    toast.warning(mensaje);
};

export const confirmarAccion = (mensaje, textoConfirmar = 'Confirmar') => {
    return new Promise((resolve) => {
        let respondido = false;
        const responder = (valor, closeToast) => {
            respondido = true;
            resolve(valor);
            closeToast();
        };

        toast(
            ({ closeToast }) => h('div', null,
                h('p', { className: 'mb-2 fw-medium' }, mensaje),
                h('div', { className: 'd-flex justify-content-end gap-2' },
                    h('button', {
                        className: 'btn btn-sm btn-secondary',
                        onClick: () => responder(false, closeToast)
                    }, 'Cancelar'),
                    h('button', {
                        className: 'btn btn-sm btn-danger',
                        onClick: () => responder(true, closeToast)
                    }, textoConfirmar)
                )
            ),
            {
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
                draggable: false,
                onClose: () => { if (!respondido) resolve(false); }
            }
        );
    });
};
