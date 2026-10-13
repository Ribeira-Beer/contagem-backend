import type { Request, Response } from 'express';
import { ConferenteService } from '../services/conferente.service';
import { AppError } from '../utils/AppError';

const conferenteService = new ConferenteService();

export class ConferenteController {

  async create(req: Request, res: Response) {
    try {
      const novoConferente = await conferenteService.createConferente(req.body);

      return res.status(201).json(novoConferente);

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

      const conferentes = await conferenteService.getAllConferentes(
        idRevenda,
        ativo
      );

      return res.status(200).json(conferentes);
        
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

      const conferente = await conferenteService.getConferenteByID(id);

      return res.status(200).json(conferente);

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

      const conferenteAtualizado = await conferenteService.updateConferente(
        id,
        req.body
      );

      return res.status(200).json(conferenteAtualizado);

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

      const conferenteInativado = await conferenteService.deleteConferente(id);

      return res.status(200).json(conferenteInativado);
      
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