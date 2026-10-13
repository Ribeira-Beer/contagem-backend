import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export class ContagemService {

  // Iniciar a Contagem
  async iniciarContagem(data: { idConferente: number; idArea: number; idRevenda: number }) {
    const contagemAberta = await prisma.contagem.findFirst({
      where: {
        idConferente: data.idConferente,
        idArea: data.idArea,
        status: 'EM_ANDAMENTO',
      },
    });

    if (contagemAberta) {
      return contagemAberta
    }

    const novaContagem = await prisma.contagem.create({
      data: {
        idConferente: data.idConferente,
        idArea: data.idArea,
        idRevenda: data.idRevenda,
        status: 'EM_ANDAMENTO',
      },
    });

    return novaContagem;
  }

  // Registrar Itens
  async registrarItem(data: {
    idContagem: number;
    codProduto: number;
    pallets: number;
    lastros: number;
    unidades: number;
    avulsas: number;
    idRevenda: number;
  }) {
    const contagem = await prisma.contagem.findUnique({
      where: { id: data.idContagem },
    });

    if (!contagem) throw new AppError('Contagem não encontrada.', 404);
    if (contagem.status !== 'EM_ANDAMENTO') throw new AppError('Esta contagem já foi finalizada.', 400);

    const produto = await prisma.produto.findUnique({
      where: { codProduto: data.codProduto },
    });

    if (!produto) throw new AppError('Produto não encontrado no sistema.', 404);

    const itemExistente = await prisma.itemContagem.findFirst({
      where: {
        idContagem: data.idContagem,
        codProduto: data.codProduto,
      },
    });

    if (itemExistente) {
      throw new AppError('Este produto já foi registrado nesta contagem. Para alterar, exclua o item e insira novamente.', 400);
    }

    return await prisma.itemContagem.create({
      data: {
        idContagem: data.idContagem,
        codProduto: data.codProduto,
        pallets: data.pallets,
        lastros: data.lastros,
        unidades: data.unidades,
        avulsas: data.avulsas,
        idRevenda: data.idRevenda
      },
    });
  }

  // Remover Itens
  async removerItem(idItem: number) {
    const item = await prisma.itemContagem.findUnique({
      where: { id: idItem },
      include: { contagem: true }
    });

    if (!item) throw new AppError('Item não encontrado.', 404);
    if (item.contagem.status !== 'EM_ANDAMENTO') throw new AppError('Não é possível alterar itens de uma contagem finalizada.', 400);

    return await prisma.itemContagem.delete({
      where: { id: idItem },
    });
  }

  // Finalizar a Contagem
  async finalizarContagem(idContagem: number) {
    const contagem = await prisma.contagem.findUnique({
      where: { id: idContagem },
    });

    if (!contagem) throw new AppError('Contagem não encontrada.', 404);
    if (contagem.status === 'FINALIZADA') throw new AppError('Esta contagem já está finalizada.', 400);

    return await prisma.contagem.update({
      where: { id: idContagem },
      data: {
        status: 'FINALIZADA',
        dataFinalizacao: new Date()
      },
    });
  }
}