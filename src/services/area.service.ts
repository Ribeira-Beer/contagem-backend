import { prisma } from '../config/prisma';
import type {
  CreateAreaDTO,
  UpdateAreaDTO,
} from '../schemas/area.schema';
import { AppError } from '../utils/AppError';

export class AreaService {
  // CREATE - Cria uma área vinculada à revenda
  async createArea(data: CreateAreaDTO) {
    const revenda = await prisma.revenda.findUnique({
      where: { id: data.idRevenda },
    });

    if (!revenda) {
      throw new AppError('Revenda não encontrada', 404);
    }

    if (!revenda.ativo) {
      throw new AppError('A revenda está inativa', 409);
    }

    const areaExistente = await prisma.area.findUnique({
      where: {
        nome_idRevenda: {
          nome: data.nome,
          idRevenda: data.idRevenda,
        },
      },
    });

    if (areaExistente) {
      throw new AppError(
        'Já existe uma área com este nome nesta revenda',
        409
      );
    }

    const novaArea = await prisma.area.create({
      data: {
        nome: data.nome,
        idRevenda: data.idRevenda,
      },
    });

    return novaArea;
  }

  // READ - Retorna as áreas de uma revenda
  async getAllAreas(idRevenda: number, ativo?: boolean) {
    const revenda = await prisma.revenda.findUnique({
      where: { id: idRevenda },
    });

    if (!revenda) {
      throw new AppError('Revenda não encontrada', 404);
    }

    const areas = await prisma.area.findMany({
      where: {
        idRevenda,
        ...(ativo !== undefined && { ativo }),
      },
      orderBy: { nome: 'asc' },
    });

    return areas;
  }

  // READ - Retorna uma área pelo ID
  async getAreaByID(id: number) {
    const area = await prisma.area.findUnique({
      where: { id },
    });

    if (!area) {
      throw new AppError('Área não encontrada', 404);
    }

    return area;
  }

  // UPDATE - Atualiza o nome da área
  async updateArea(id: number, data: UpdateAreaDTO) {
    const area = await this.getAreaByID(id);

    if (data.nome !== undefined) {
      const areaExistente = await prisma.area.findFirst({
        where: {
          nome: data.nome,
          idRevenda: area.idRevenda,
          id: { not: id },
        },
      });

      if (areaExistente) {
        throw new AppError(
          'Já existe uma área com este nome nesta revenda',
          409
        );
      }
    }

    const areaAtualizada = await prisma.area.update({
      where: { id },
      data,
    });

    return areaAtualizada;
  }

  // DELETE - Inativa uma área pelo ID
  async deleteArea(id: number) {
    await this.getAreaByID(id);

    const areaInativada = await prisma.area.update({
      where: { id },
      data: { ativo: false },
    });

    return areaInativada;
  }
}