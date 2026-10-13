import { z } from 'zod';

export const createRevendaSchema = z.object({
  codOperacao: z.number().int().positive(
    'O código de operação deve ser positivo'
  ),
  nome: z.string().trim().min(3).max(150),
  cnpj: z.string()
    .trim()
    .regex(
      /^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/,
      'Informe o CNPJ com 14 dígitos ou no formato XX.XXX.XXX/XXXX-XX'
    )
    .transform((valor) => valor.replace(/\D/g, '')),
  cep: z.string()
    .trim()
    .regex(
      /^\d{5}-?\d{3}$/,
      'Informe o CEP com 8 dígitos ou no formato XXXXX-XXX'
    )
    .transform((valor) => valor.replace(/\D/g, '')),
  estado: z.string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, 'O estado deve ter 2 letras (UF)'),
  cidade: z.string().trim().min(1).max(100),
  bairro: z.string().trim().min(1).max(100),
  logradouro: z.string().trim().min(1).max(150),
  numero: z.number().int().nonnegative(),
});

export const updateRevendaSchema = createRevendaSchema
  .omit({
    codOperacao: true,
    cnpj: true,
  })
  .extend({
    ativo: z.boolean(),
  })
  .partial()
  .refine(
    (dados) => Object.values(dados).some((valor) => valor !== undefined),
    { message: 'Informe pelo menos um campo para atualizar' }
  );

export type CreateRevendaDTO = z.infer<typeof createRevendaSchema>;
export type UpdateRevendaDTO = z.infer<typeof updateRevendaSchema>;

export const listRevendasSchema = z.object({
  ativo: z.enum(['true', 'false'])
    .transform((valor) => valor === 'true')
    .optional(),
});