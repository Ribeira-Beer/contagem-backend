import { z } from 'zod';

export const createAreaSchema = z.object({
  nome: z.string().trim().min(1).max(100),
  idRevenda: z.number().int().positive(),
});

export const updateAreaSchema = createAreaSchema
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

export type CreateAreaDTO = z.infer<typeof createAreaSchema>;
export type UpdateAreaDTO = z.infer<typeof updateAreaSchema>;

export const listAreasSchema = z.object({
  ativo: z.enum(['true', 'false'])
    .transform((valor) => valor === 'true')
    .optional(),
});