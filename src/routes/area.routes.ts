import { Router } from 'express';
import { AreaController } from '../controllers/area.controller';
import { validar } from '../middlewares/validar';
import { idParamsSchema, idRevendaParamsSchema } from '../schemas/common.schema';
import { createAreaSchema, updateAreaSchema, listAreasSchema } from '../schemas/area.schema';

const areaRoutes = Router();
const areaController = new AreaController();

areaRoutes.post(
  '/',
  validar({ body: createAreaSchema }),
  (req, res) => areaController.create(req, res)
);

areaRoutes.get(
  '/revenda/:idRevenda',
  validar({
    params: idRevendaParamsSchema,
    query: listAreasSchema,
  }),
  (req, res) => areaController.getAll(req, res)
);

areaRoutes.get(
  '/:id',
  validar({ params: idParamsSchema }),
  (req, res) => areaController.getById(req, res)
);

areaRoutes.put(
  '/:id',
  validar({
    params: idParamsSchema,
    body: updateAreaSchema,
  }),
  (req, res) => areaController.update(req, res)
);

areaRoutes.delete(
  '/:id',
  validar({ params: idParamsSchema }),
  (req, res) => areaController.delete(req, res)
);

export { areaRoutes };