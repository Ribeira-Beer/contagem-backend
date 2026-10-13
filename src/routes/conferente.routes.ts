import { Router } from 'express';
import { ConferenteController } from '../controllers/conferente.controller';
import { validar } from '../middlewares/validar';
import { idParamsSchema, idRevendaParamsSchema } from '../schemas/common.schema';
import { createConferenteSchema, updateConferenteSchema, listConferentesSchema } from '../schemas/conferente.schema';

const conferenteRoutes = Router();
const conferenteController = new ConferenteController();

conferenteRoutes.post(
  '/',
  validar({ body: createConferenteSchema }),
  (req, res) => conferenteController.create(req, res)
);

conferenteRoutes.get(
  '/revenda/:idRevenda',
  validar({
    params: idRevendaParamsSchema,
    query: listConferentesSchema,
  }),
  (req, res) => conferenteController.getAll(req, res)
);

conferenteRoutes.get(
  '/:id',
  validar({ params: idParamsSchema }),
  (req, res) => conferenteController.getById(req, res)
);

conferenteRoutes.put(
  '/:id',
  validar({
    params: idParamsSchema,
    body: updateConferenteSchema,
  }),
  (req, res) => conferenteController.update(req, res)
);

conferenteRoutes.delete(
  '/:id',
  validar({ params: idParamsSchema }),
  (req, res) => conferenteController.delete(req, res)
);

export { conferenteRoutes };