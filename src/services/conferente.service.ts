import { prisma } from '../config/prisma';
import type { CreateConferenteDTO, UpdateConferenteDTO } from '../schemas/conferente.schema';
import { AppError } from '../utils/AppError';

export class ConferenteService {
  // CREATE - Cria um novo conferente
  async createConferente(data: CreateConferenteDTO) {
    const revenda = await prisma.revenda.findUnique({
      where: { id: data.idRevenda },
    });

    if (!revenda) {
      throw new AppError('Revenda não encontrada', 404);
    }

    if (!revenda.ativo) {
      throw new AppError('A revenda está inativa', 409);
    }

    const conferenteExistente = await prisma.conferente.findUnique({
      where: { cpf: data.cpf },
    });

    if (conferenteExistente) {
      throw new AppError('Já existe um conferente com este CPF', 409);
    }

    const novoConferente = await prisma.conferente.create({
      data: {
        nome: data.nome,
        cpf: data.cpf,
        idRevenda: data.idRevenda,
      },
    });

    return novoConferente;
  }

  // READ - Retorna todos os conferentes de uma revenda
  async getAllConferentes(idRevenda: number, ativo?: boolean) {
    const revenda = await prisma.revenda.findUnique({
      where: { id: idRevenda },
    });

    if (!revenda) {
      throw new AppError('Revenda não encontrada', 404);
    }

    const conferentes = await prisma.conferente.findMany({
      where: {
        idRevenda,
        ...(ativo !== undefined && { ativo }),
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return conferentes;
  }

  // READ - Retorna um conferente pelo ID
  async getConferenteByID(id: number) {
    const conferente = await prisma.conferente.findUnique({
      where: { id },
    });

    if (!conferente) {
      throw new AppError('Conferente não encontrado', 404);
    }

    return conferente;
  }

  // UPDATE - Atualiza um conferente pelo ID
  async updateConferente(id: number, data: UpdateConferenteDTO) {
    const conferente = await this.getConferenteByID(id);

    if (data.ativo === true) {
      const revenda = await prisma.revenda.findUnique({
        where: { id: conferente.idRevenda },
      });

      if (!revenda || !revenda.ativo) {
        throw new AppError(
          'Não é possível ativar um conferente de revenda inativa',
          409
        );
      }
    }

    const conferenteAtualizado = await prisma.conferente.update({
      where: { id },
      data,
    });

    return conferenteAtualizado;
  }

  // DELETE - Inativa um conferente pelo ID
  async deleteConferente(id: number) {
    const conferenteInativado = await this.updateConferente(id, {
      ativo: false,
    });

    return conferenteInativado;
  }
}