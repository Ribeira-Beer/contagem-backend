import { z } from 'zod';

export const createProdutoSchema = z.object({
  codProduto: z.number().int().positive("O código do produto deve ser positivo"),
  nomeCompleto: z.string().trim().min(3).max(150),
  nomeAbreviado: z.string().trim().min(3).max(100),
  cesta: z.string().trim().min(3).max(60),
  familia: z.string().trim().min(3).max(60),
  tipoEmbalagem: z.string().trim().min(3).max(60),
  unidadesEmbalagem: z.number().int().positive(),
  embalagensLastro: z.number().int().nonnegative(),
  embalagensPallet47: z.number().int().nonnegative(),
  embalagensPallet60: z.number().int().nonnegative(),
  hl: z.number().positive().multipleOf(0.0001),
  idRevenda: z.number().int().positive()
});

export const updateProdutoSchema = createProdutoSchema
  .omit({
    codProduto: true,
  })
  .extend({
    ativo: z.boolean()
  })
  .partial()
  .refine(
    (dados) => Object.values(dados).some((valor) => valor !== undefined),
    { message: 'Informe pelo menos um campo para atualizar' }
  )
  ;

export type CreateProdutoDTO = z.infer<typeof createProdutoSchema>;
export type UpdateProdutoDTO = z.infer<typeof updateProdutoSchema>;

export const listProdutosSchema = z.object({
  ativo: z.enum(['true', 'false'])
    .transform((valor) => valor === 'true')
    .optional(),
});