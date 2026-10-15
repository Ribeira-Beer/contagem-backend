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
      include: { itens: { include: { produto: true }, orderBy: { id: 'asc' } } },
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
      include: { itens: { include: { produto: true }, orderBy: { id: 'asc' } } },
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

  // Editar Item (Admin) - Se estava APROVADA, volta para FINALIZADA
  async atualizarItem(idItem: number, idRevenda: number, data: { pallets: number; lastros: number; unidades: number; avulsas: number }) {
    const item = await prisma.itemContagem.findUnique({
      where: { id: idItem },
      include: { contagem: true },
    });

    if (!item || item.idRevenda !== idRevenda) throw new AppError('Item não encontrado.', 404);

    if (item.contagem.status === 'APROVADA') {
      await prisma.contagem.update({
        where: { id: item.idContagem },
        data: { status: 'FINALIZADA' },
      });
    }

    return await prisma.itemContagem.update({
      where: { id: idItem },
      data,
      include: { produto: true },
    });
  }

  // Remover Item (Conferente só EM_ANDAMENTO | Admin em qualquer status, voltando APROVADA -> FINALIZADA)
  async removerItem(idItem: number, usuario?: { tipo: string; idRevenda: number }) {
    const item = await prisma.itemContagem.findUnique({
      where: { id: idItem },
      include: { contagem: true },
    });

    if (!item) throw new AppError('Item não encontrado.', 404);
    if (usuario?.idRevenda && item.idRevenda !== Number(usuario.idRevenda)) {
      throw new AppError('Acesso negado.', 403);
    }

    if (usuario?.tipo !== 'ADMIN' && item.contagem.status !== 'EM_ANDAMENTO') {
      throw new AppError('Não é possível alterar itens de uma contagem finalizada.', 400);
    }

    if (item.contagem.status === 'APROVADA') {
      await prisma.contagem.update({
        where: { id: item.idContagem },
        data: { status: 'FINALIZADA' },
      });
    }

    return await prisma.itemContagem.delete({ where: { id: idItem } });
  }

  // Aprovar a Contagem (Admin)
  async aprovarContagem(idContagem: number, idRevenda: number) {
    const contagem = await prisma.contagem.findFirst({
      where: { id: idContagem, idRevenda },
    });

    if (!contagem) throw new AppError('Contagem não encontrada.', 404);
    if (contagem.status === 'EM_ANDAMENTO') {
      throw new AppError('Finalize a contagem antes de aprovar.', 400);
    }

    return await prisma.contagem.update({
      where: { id: idContagem },
      data: { status: 'APROVADA' },
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

  // Listar contagens por revenda, conferente e data
  async listarContagens(filtros: { idRevenda: number; idConferente?: number; data?: string }) {
    let filtroData = {};

    if (filtros.data) {
      const inicio = new Date(`${filtros.data}T00:00:00.000Z`);
      const fim = new Date(`${filtros.data}T23:59:59.999Z`);
      filtroData = { dataAbertura: { gte: inicio, lte: fim } };
    }

    return await prisma.contagem.findMany({
      where: {
        idRevenda: filtros.idRevenda,
        ...(filtros.idConferente && { idConferente: filtros.idConferente }),
        ...filtroData,
      },
      include: {
        area: true,
        conferente: { select: { id: true, nome: true, cpf: true } },
        _count: { select: { itens: true } }
      },
      orderBy: { dataAbertura: 'desc' },
    });
  }

  // Buscar uma contagem específica completa pelo ID
  async buscarPorId(idContagem: number, idRevenda?: number) {
    const contagem = await prisma.contagem.findFirst({
      where: {
        id: idContagem,
        ...(idRevenda && { idRevenda }),
      },
      include: {
        area: true,
        conferente: { select: { id: true, nome: true, cpf: true } },
        itens: {
          include: { produto: true },
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!contagem) throw new AppError('Contagem não encontrada.', 404);
    return contagem;
  }

  // Exportar CSV (Admin)
  async exportarCSV(idContagem: number, idRevenda: number, armazem: string, deposito: string, tipoPallet: '47' | '60') {
    const contagem = await prisma.contagem.findFirst({
      where: { id: idContagem, idRevenda },
      include: {
        itens: {
          include: { produto: true },
          orderBy: { id: 'asc' }
        }
      }
    });

    if (!contagem) throw new AppError('Contagem não encontrada.', 404);
    if (contagem.status !== 'APROVADA') throw new AppError('Apenas contagens APROVADAS podem ser exportadas.', 400);
    if (contagem.itens.length === 0) throw new AppError('A contagem está vazia.', 400);

    const linhas = contagem.itens.map((item: {
      produto: { embalagensPallet47: number; embalagensPallet60: number; embalagensLastro: number };
      pallets: number;
      lastros: number;
      unidades: number;
      avulsas: number;
      codProduto: number;
    }) => {
      const prod = item.produto;
      const multiplicadorPallet = tipoPallet === '47' ? prod.embalagensPallet47 : prod.embalagensPallet60;

      // Cálculo da quantidade inteira em caixas
      const qtdInteira = (item.pallets * multiplicadorPallet) + (item.lastros * prod.embalagensLastro) + item.unidades;

      // Formatação: ARMAZEM(2);DEPOSITO(2);COD_PRODUTO(7);QTD_INTEIRA(7);AVULSAS(2)
      return [
        armazem,
        deposito,
        String(item.codProduto).padStart(7, '0'),
        String(qtdInteira).padStart(7, '0'),
        String(item.avulsas).padStart(2, '0')
      ].join(';');
    });

    return linhas.join('\n');
  }
}