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

  async removerItem(req: Request, res: Response) {
    try {
      const { idItem } = req.params;
      
      await contagemService.removerItem(Number(idItem));
      
      return res.status(204).send();
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
}