import { object, string, number } from 'yup';

export const categoriaSchema = object({
    nombre: string()
        .trim()
        .required('El nombre es obligatorio.')
        .max(100, 'El nombre supera el límite de caracteres permitidos.'),
    orden: number()
        .typeError('El orden debe ser un número.')
        .required('El orden es obligatorio.')
        .integer('El orden debe ser un número entero.')
}).noUnknown(true);
