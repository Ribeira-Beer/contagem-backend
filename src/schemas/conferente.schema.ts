import { z } from 'zod';

export const createConferenteSchema = z.object({
  nome: z.string().trim().min(3).max(150),
  cpf: z.string()
    .trim()
    .regex(
      /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/,
      'Informe o CPF com 11 dígitos ou no formato XXX.XXX.XXX-XX'
    )
    .transform((valor) => valor.replace(/\D/g, '')),
  idRevenda: z.number().int().positive(),
});

export const updateConferenteSchema = createConferenteSchema
  .pick({
    nome: true,
  })
  .extend({
    ativo: z.boolean(),
  })
  .partial()
  .refine(
    (dados) => Object.values(dados).some((valor) => valor !== undefined),
    { message: 'Informe pelo menos um campo para atualizar' }
  );

export type CreateConferenteDTO = z.infer<typeof createConferenteSchema>;
export type UpdateConferenteDTO = z.infer<typeof updateConferenteSchema>;

export const listConferentesSchema = z.object({
  ativo: z.enum(['true', 'false'])
    .transform((valor) => valor === 'true')
    .optional(),
});