import type { Request, Response } from 'express';
import { ProdutoService } from '../services/produto.service';
import { AppError } from '../utils/AppError';

const produtoService = new ProdutoService();

export class ProdutoController {

  async create(req: Request, res: Response) {
    try {
      const novoProduto = await produtoService.createProduto(req.body);

      return res.status(201).json(novoProduto);

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

      const produtos = await produtoService.getAllProdutos(
        idRevenda,
        ativo
      );

      return res.status(200).json(produtos);

    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          error: error.message
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

      const produto = await produtoService.getProdutoByID(id);

      return res.status(200).json(produto);

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

      const produtoAtualizado = await produtoService.updateProduto(
        id,
        req.body
      );

      return res.status(200).json(produtoAtualizado);

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

      const produtoInativado = await produtoService.deleteProduto(id);

      return res.status(200).json(produtoInativado);

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

  async uploadExcel(req: Request, res: Response) {
    try {
      const file = (req as Request & { file?: { path: string } }).file;

      if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo Excel foi enviado.' });
      }

      const idRevenda = undefined;

      const resultado = await produtoService.uploadProdutosExcel(file.path, idRevenda);
      return res.status(201).json(resultado);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao processar upload' });
    }
  }
}