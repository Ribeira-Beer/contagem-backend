import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { login, senha } = req.body;
      
      if (!login || !senha) {
        return res.status(400).json({ error: 'Informe login (e-mail/CPF) e senha.' });
      }

      const resultado = await authService.login(login, senha);
      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}