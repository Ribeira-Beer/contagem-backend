import { Router } from 'express';
import { ContagemController } from '../controllers/contagem.controller';
import { validar } from '../middlewares/validar';
import { idParamsSchema } from '../schemas/common.schema';
import { iniciarContagemSchema, registrarItemSchema } from '../schemas/contagem.schema';

const contagemRoutes = Router();
const contagemController = new ContagemController();

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

import { z } from 'zod';
const idItemParamsSchema = z.object({ idItem: z.coerce.number().int().positive() });

contagemRoutes.delete(
  '/itens/:idItem', 
  validar({ params: idItemParamsSchema }), 
  contagemController.removerItem.bind(contagemController)
);

export { contagemRoutes };