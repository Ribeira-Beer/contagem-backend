import { Router } from 'express';
import multer from 'multer';
import { ProdutoController } from '../controllers/produto.controller';
import { validar } from '../middlewares/validar';
import { idParamsSchema, idRevendaParamsSchema } from '../schemas/common.schema';
import { createProdutoSchema, updateProdutoSchema, listProdutosSchema } from '../schemas/produto.schema';

const produtoRoutes = Router();
const produtoController = new ProdutoController();

const upload = multer({ dest: 'uploads/' });

produtoRoutes.post(
  '/upload',
  upload.single('arquivoExcel'), 
  (req, res) => produtoController.uploadExcel(req, res)
);

produtoRoutes.post(
  '/',
  validar({ body: createProdutoSchema }),
  (req, res) => produtoController.create(req, res)
);

produtoRoutes.get(
  '/revenda/:idRevenda',
  validar({
    params: idRevendaParamsSchema,
    query: listProdutosSchema,
  }),
  (req, res) => produtoController.getAll(req, res)
);

produtoRoutes.get(
  '/:id',
  validar({ params: idParamsSchema }),
  (req, res) => produtoController.getById(req, res)
);

produtoRoutes.put(
  '/:id',
  validar({
    params: idParamsSchema,
    body: updateProdutoSchema,
  }),
  (req, res) => produtoController.update(req, res)
);

produtoRoutes.delete(
  '/:id',
  validar({ params: idParamsSchema }),
  (req, res) => produtoController.delete(req, res)
);

export { produtoRoutes };