import { Request, Response } from 'express';
import { RevendaService } from '../services/revenda.service';
import { AppError } from '../utils/AppError';

const revendaService = new RevendaService();

export class RevendaController {

  async create(req: Request, res: Response) {
    try {
      const novaRevenda = await revendaService.createRevenda(req.body);

      return res.status(201).json(novaRevenda); 

    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  }


  async getAll(req: Request, res: Response) {
    try {
      const { ativo } = res.locals.query;
      const revendas = await revendaService.getAllRevendas(ativo);

      return res.status(200).json(revendas);

    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = res.locals.params;

      const revenda = await revendaService.getRevendaByID(id);

      return res.status(200).json(revenda);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = res.locals.params;

      const revendaAtualizada = await revendaService.updateRevenda(
        id,
        req.body
      );

      return res.status(200).json(revendaAtualizada);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = res.locals.params;

      const revendaInativada = await revendaService.deleteRevenda(id);

      return res.status(200).json(revendaInativada);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message,
        });
      }

      console.error(error);

      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  }
}