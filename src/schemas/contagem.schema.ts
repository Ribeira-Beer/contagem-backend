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

export const atualizarItemSchema = z.object({
  pallets: z.number().int().nonnegative().optional().default(0),
  lastros: z.number().int().nonnegative().optional().default(0),
  unidades: z.number().int().nonnegative().optional().default(0),
  avulsas: z.number().int().nonnegative().optional().default(0),
}).refine(
  (d) => d.pallets > 0 || d.lastros > 0 || d.unidades > 0 || d.avulsas > 0,
  { message: 'Informe pelo menos um valor maior que zero.' }
);

export type IniciarContagemDTO = z.infer<typeof iniciarContagemSchema>;
export type RegistrarItemDTO = z.infer<typeof registrarItemSchema>;

export const listarContagensQuerySchema = z.object({
  idConferente: z.coerce.number().int().positive().optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato YYYY-MM-DD').optional(),
});

export const exportarContagemQuerySchema = z.object({
  armazem: z.string().min(1).max(2).transform(v => v.padStart(2, '0')),
  deposito: z.string().min(1).max(2).transform(v => v.padStart(2, '0')),
  tipoPallet: z.enum(['47', '60'])
});