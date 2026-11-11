import { object, string } from 'yup';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,}$/;

export const loginSchema = object({
    email: string()
        .required('El email es obligatorio.')
        .matches(emailRegex, 'El email debe ser válido (ej: usuario@dominio.com)')
        .max(100, 'El email supera el límite de caracteres permitidos.'),
    password: string()
        .required('La contraseña es obligatoria.')
        .max(50, 'La contraseña supera el límite de caracteres permitidos.')
}).noUnknown(true).strict();
