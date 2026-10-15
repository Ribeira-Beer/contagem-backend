import { Request, Response } from 'express';
import { ContagemService } from '../services/contagem.service';

const contagemService = new ContagemService();

export class ContagemController {

  async iniciar(req: Request, res: Response) {
    try {
      const { idConferente, idArea, idRevenda } = req.body;

      const contagem = await contagemService.iniciarContagem({
        idConferente: Number(idConferente),
        idArea: Number(idArea),
        idRevenda: Number(idRevenda)
      });

      return res.status(201).json(contagem);
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async registrarItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { codProduto, pallets, lastros, unidades, avulsas, idRevenda } = req.body;

      const item = await contagemService.registrarItem({
        idContagem: Number(id),
        codProduto: Number(codProduto),
        pallets: Number(pallets || 0),
        lastros: Number(lastros || 0),
        unidades: Number(unidades || 0),
        avulsas: Number(avulsas || 0),
        idRevenda: Number(idRevenda)
      });

      return res.status(201).json(item);
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async atualizarItem(req: Request, res: Response) {
    try {
      const usuario = (req as any).usuario;
      const { idItem } = res.locals.params || req.params;
      const item = await contagemService.atualizarItem(Number(idItem), Number(usuario.idRevenda), req.body);
      return res.status(200).json(item);
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async removerItem(req: Request, res: Response) {
    try {
      const usuario = (req as any).usuario;
      const { idItem } = res.locals.params || req.params;
      await contagemService.removerItem(Number(idItem), usuario);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async aprovar(req: Request, res: Response) {
    try {
      const usuario = (req as any).usuario;
      const { id } = res.locals.params || req.params;
      const contagem = await contagemService.aprovarContagem(Number(id), Number(usuario.idRevenda));
      return res.status(200).json(contagem);
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async finalizar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const contagem = await contagemService.finalizarContagem(Number(id));

      return res.status(200).json(contagem);
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const usuario = (req as any).usuario;
      const { idConferente, data } = res.locals.query || req.query;

      const contagens = await contagemService.listarContagens({
        idRevenda: Number(usuario.idRevenda),
        idConferente: idConferente ? Number(idConferente) : undefined,
        data: data ? String(data) : undefined,
      });

      return res.status(200).json(contagens);
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const usuario = (req as any).usuario;
      const { id } = res.locals.params || req.params;

      const contagem = await contagemService.buscarPorId(
        Number(id),
        usuario.idRevenda ? Number(usuario.idRevenda) : undefined
      );

      return res.status(200).json(contagem);
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async exportar(req: Request, res: Response) {
    try {
      const usuario = (req as any).usuario;
      const { id } = res.locals.params || req.params;
      const { armazem, deposito, tipoPallet } = res.locals.query || req.query;

      const csvContent = await contagemService.exportarCSV(
        Number(id),
        Number(usuario.idRevenda),
        armazem,
        deposito,
        tipoPallet
      );

      // Define os headers para forçar o download do arquivo CSV
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="contagem_${id}_promax.csv"`);
      return res.status(200).send(csvContent);
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }
}