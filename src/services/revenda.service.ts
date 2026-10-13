import { prisma } from "../config/prisma";
import type { CreateRevendaDTO, UpdateRevendaDTO } from '../schemas/revenda.schema';
import { AppError } from '../utils/AppError';

export class RevendaService {
  // CREATE - Cria uma nova revenda
  async createRevenda(data: CreateRevendaDTO) {
    const revendaExistente = await prisma.revenda.findFirst({
      where: {
        OR: [{ codOperacao: data.codOperacao }, { cnpj: data.cnpj }],
      },
    });

    if (revendaExistente) {
      if (revendaExistente.codOperacao === data.codOperacao) {
        throw new AppError(
          'Já existe uma revenda com este código de operação.',
          409
        );
      }
      if (revendaExistente.cnpj === data.cnpj) {
        throw new AppError(
          'Já existe uma revenda com este CNPJ.',
          409
        );
      }
    }

    const novaRevenda = await prisma.revenda.create({
      data: {
        codOperacao: data.codOperacao,
        nome: data.nome,
        cnpj: data.cnpj,
        cep: data.cep,
        estado: data.estado,
        cidade: data.cidade,
        bairro: data.bairro,
        logradouro: data.logradouro,
        numero: data.numero,
      },
    });

    return novaRevenda;
  }

  // READ - Retorna todas as revendas
  async getAllRevendas(ativo?: boolean) {
    const revendas = await prisma.revenda.findMany({
      where: {
        ...(ativo !== undefined && { ativo })
      },
      orderBy: {
        nome: "asc",
      }
    });

    return revendas;
  }

  // READ - Retorna uma revenda pelo ID
  async getRevendaByID(id: number) {
    const revenda = await prisma.revenda.findUnique({
      where: { id },
    });

    if (!revenda) {
      throw new AppError(
        'Revenda não encontrada',
        404
      );
    }

    return revenda;
  }

  // UPDATE - Atualiza uma revenda pelo ID
  async updateRevenda(id: number, data: UpdateRevendaDTO) {
    const revenda = await prisma.revenda.findUnique({
      where: { id },
    });

    if (!revenda) {
      throw new AppError('Revenda não encontrada', 404);
    }

    const revendaAtualizada = await prisma.revenda.update({
      where: { id },
      data: { ...data },
    });

    return revendaAtualizada;
  }

  // DELETE - Inativa uma revenda pelo ID
  async deleteRevenda(id: number) {

    const revenda = await prisma.revenda.findUnique({
      where: { id }
    });

    if (!revenda) {
      throw new AppError('Revenda não encontrada', 404);
    }

    return await prisma.revenda.update({
      where: { id },
      data: { ativo: false },
    });

  }
}
