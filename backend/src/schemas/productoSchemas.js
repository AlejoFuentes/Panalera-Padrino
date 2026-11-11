import { object, string, number } from 'yup';

export const productoSchema = object({
    nombre: string()
        .trim()
        .required('El nombre es obligatorio.')
        .max(150, 'El nombre supera el límite de caracteres permitidos.'),
    descripcion: string()
        .trim()
        .required('La descripción es obligatoria.')
        .max(2000, 'La descripción supera el límite de caracteres permitidos.'),
    precio_unitario: number()
        .typeError('El precio unitario debe ser un número.')
        .required('El precio unitario es obligatorio.')
        .min(0, 'El precio unitario no puede ser negativo.'),
    precio_mayorista: number()
        .typeError('El precio mayorista debe ser un número.')
        .required('El precio mayorista es obligatorio.')
        .min(0, 'El precio mayorista no puede ser negativo.'),
    categoria_id: number()
        .typeError('La categoría es inválida.')
        .required('La categoría es obligatoria.')
        .integer('La categoría es inválida.'),
    imagen: string().optional()
}).noUnknown(true);

export const aumentoPreciosSchema = object({
    porcentaje: number()
        .typeError('El porcentaje debe ser un número.')
        .required('El porcentaje es obligatorio.')
        .moreThan(-100, 'El porcentaje debe ser mayor a -100.')
        .max(1000, 'El porcentaje es demasiado alto.')
}).noUnknown(true);
