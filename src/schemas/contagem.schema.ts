import { z } from 'zod';

export const iniciarContagemSchema = z.object({
  idConferente: z.number().int().positive('O ID do conferente deve ser válido'),
  idArea: z.number().int().positive('O ID da área deve ser válido'),
  idRevenda: z.number().int().positive('O ID da revenda deve ser válido'),
});

export const registrarItemSchema = z.object({
  codProduto: z.number().int().positive('O código do produto deve ser válido'),
  pallets: z.number().int().nonnegative().optional().default(0),
  lastros: z.number().int().nonnegative().optional().default(0),
  unidades: z.number().int().nonnegative().optional().default(0),
  avulsas: z.number().int().nonnegative().optional().default(0),
  idRevenda: z.number().int().positive('O ID da revenda é obrigatório'),
}).refine(
  (data) => data.pallets > 0 || data.lastros > 0 || data.unidades > 0 || data.avulsas > 0,
  { message: 'A quantidade total bipada não pode ser zero. Informe pelo menos um valor.' }
);

export type IniciarContagemDTO = z.infer<typeof iniciarContagemSchema>;
export type RegistrarItemDTO = z.infer<typeof registrarItemSchema>;