import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido. Faça login.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET || 'secret');
    
    (req as any).usuario = decoded;

    next();
    
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}