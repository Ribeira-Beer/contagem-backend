import type { Request, Response } from 'express';
import { AreaService } from '../services/area.service';
import { AppError } from '../utils/AppError';

const areaService = new AreaService();

export class AreaController {
  async create(req: Request, res: Response) {
    try {
      const novaArea = await areaService.createArea(req.body);
      return res.status(201).json(novaArea);

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
      const { idRevenda } = res.locals.params;
      const { ativo } = res.locals.query;

      const areas = await areaService.getAllAreas(idRevenda, ativo);

      return res.status(200).json(areas);

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
      const area = await areaService.getAreaByID(id);

      return res.status(200).json(area);

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
      const areaAtualizada = await areaService.updateArea(id, req.body);

      return res.status(200).json(areaAtualizada);

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
      const areaInativada = await areaService.deleteArea(id);

      return res.status(200).json(areaInativada);

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