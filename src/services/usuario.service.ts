import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcrypt';

export class UsuarioService {
  async criar(data: { email?: string; cpf?: string; senha: string; tipo: string; idConferente?: number }) {
    if (!data.email && !data.cpf) throw new AppError('Informe e-mail ou CPF.');

    const senhaHash = await bcrypt.hash(data.senha, 10);

    return await prisma.usuario.create({
      data: {
        email: data.email,
        cpf: data.cpf,
        senha: senhaHash,
        tipo: data.tipo,
        conferente: data.idConferente ? { connect: { id: data.idConferente } } : undefined
      },
      select: { id: true, email: true, cpf: true, tipo: true }
    });
  }
}