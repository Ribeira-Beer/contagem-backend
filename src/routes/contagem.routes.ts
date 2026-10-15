import { Router } from 'express';
import { ContagemController } from '../controllers/contagem.controller';
import { validar } from '../middlewares/validar';
import { idParamsSchema } from '../schemas/common.schema';
import {
  iniciarContagemSchema,
  registrarItemSchema,
  listarContagensQuerySchema,
  atualizarItemSchema,
  exportarContagemQuerySchema
} from '../schemas/contagem.schema';
import { adminMiddleware } from '../middlewares/auth.middleware';
import { z } from 'zod';

const contagemRoutes = Router();
const contagemController = new ContagemController();
const idItemParamsSchema = z.object({ idItem: z.coerce.number().int().positive() });

contagemRoutes.post(
  '/',
  validar({ body: iniciarContagemSchema }),
  contagemController.iniciar.bind(contagemController)
);

contagemRoutes.put(
  '/:id/finalizar',
  validar({ params: idParamsSchema }),
  contagemController.finalizar.bind(contagemController)
);

contagemRoutes.post(
  '/:id/itens',
  validar({
    params: idParamsSchema,
    body: registrarItemSchema
  }),
  contagemController.registrarItem.bind(contagemController)
);

contagemRoutes.delete(
  '/itens/:idItem',
  validar({ params: idItemParamsSchema }),
  contagemController.removerItem.bind(contagemController)
);

contagemRoutes.get(
  '/',
  validar({ query: listarContagensQuerySchema }),
  contagemController.listar.bind(contagemController)
);

contagemRoutes.get(
  '/:id',
  validar({ params: idParamsSchema }),
  contagemController.buscarPorId.bind(contagemController)
);

contagemRoutes.put(
  '/itens/:idItem',
  adminMiddleware,
  validar({ params: idItemParamsSchema, body: atualizarItemSchema }),
  contagemController.atualizarItem.bind(contagemController)
);

contagemRoutes.put(
  '/:id/aprovar',
  adminMiddleware,
  validar({ params: idParamsSchema }),
  contagemController.aprovar.bind(contagemController)
);

contagemRoutes.get(
  '/:id/exportar',
  adminMiddleware,
  validar({ params: idParamsSchema, query: exportarContagemQuerySchema }),
  contagemController.exportar.bind(contagemController)
);

export { contagemRoutes };