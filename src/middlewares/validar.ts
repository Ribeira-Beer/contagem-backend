import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ZodType } from 'zod';

interface Schemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export const validar = (schemas: Schemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        res.locals.params = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        res.locals.query = schemas.query.parse(req.query);
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          detalhes: error.issues,
        });
      }

      console.error(error);

      return res.status(500).json({
        error: 'Erro interno de validação',
      });
    }

    next();
  };
};