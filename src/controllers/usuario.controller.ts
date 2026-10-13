import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';

const usuarioService = new UsuarioService();

export class UsuarioController {
  async criar(req: Request, res: Response) {
    try {
      const usuario = await usuarioService.criar(req.body);
      return res.status(201).json(usuario);
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}