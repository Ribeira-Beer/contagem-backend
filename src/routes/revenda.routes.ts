import { Router } from 'express';
import { RevendaController } from '../controllers/revenda.controller';
import { validar } from '../middlewares/validar';
import { idParamsSchema } from '../schemas/common.schema';
import { createRevendaSchema, updateRevendaSchema, listRevendasSchema } from '../schemas/revenda.schema';

const revendaRoutes = Router();
const revendaController = new RevendaController();

revendaRoutes.post(
  '/',
  validar({ body: createRevendaSchema }),
  (req, res) => revendaController.create(req, res)
);

revendaRoutes.get(
  '/',
  validar({ query: listRevendasSchema }),
  (req, res) => revendaController.getAll(req, res)
);

revendaRoutes.get(
  '/:id',
  validar({ params: idParamsSchema }),
  (req, res) => revendaController.getById(req, res)
);

revendaRoutes.put(
  '/:id',
  validar({
    params: idParamsSchema,
    body: updateRevendaSchema,
  }),
  (req, res) => revendaController.update(req, res)
);

revendaRoutes.delete(
  '/:id',
  validar({ params: idParamsSchema }),
  (req, res) => revendaController.delete(req, res)
);

export { revendaRoutes };