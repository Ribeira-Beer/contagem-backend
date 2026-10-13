import { z } from 'zod';

const idSchema = z.coerce.number()
  .int('O ID deve ser inteiro')
  .positive('O ID deve ser positivo')
  .max(2147483647, 'O ID excede o limite permitido');

export const idParamsSchema = z.object({
  id: idSchema,
});

export const idRevendaParamsSchema = z.object({
  idRevenda: idSchema,
});