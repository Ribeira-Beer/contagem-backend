import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  async login(loginDados: string, senhaDigitada: string) {

    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: loginDados },
          { cpf: loginDados }
        ]
      },
      include: {
        conferente: true 
      }
    });

    if (!usuario) {
      throw new AppError('Usuário ou senha incorretos.', 401);
    }

    if (!usuario.ativo) {
      throw new AppError('Este usuário está inativo.', 403);
    }

    const senhaCorreta = await bcrypt.compare(senhaDigitada, usuario.senha);
    if (!senhaCorreta) {
      throw new AppError('Usuário ou senha incorretos.', 401);
    }

    // Gera o token
    const token = jwt.sign(
      { 
        idUsuario: usuario.id, 
        tipo: usuario.tipo,
        idRevenda: usuario.conferente?.idRevenda
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        tipo: usuario.tipo,
        nome: usuario.conferente?.nome || 'Administrador'
      }
    };
  }
}