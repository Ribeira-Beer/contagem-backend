import { prisma } from '../config/prisma';
import type { CreateProdutoDTO, UpdateProdutoDTO } from '../schemas/produto.schema';
import { AppError } from '../utils/AppError';
import fs from 'fs';
import xlsx from 'xlsx';

export class ProdutoService {
  // CREATE - Cria um novo produto
  async createProduto(data: CreateProdutoDTO) {
    const revenda = await prisma.revenda.findUnique({
      where: { id: data.idRevenda },
    });

    if (!revenda) {
      throw new AppError('Revenda não encontrada', 404);
    }

    if (!revenda.ativo) {
      throw new AppError('A revenda está inativa', 409);
    }

    const produtoExistente = await prisma.produto.findUnique({
      where: { codProduto: data.codProduto },
    });

    if (produtoExistente) {
      throw new AppError('Já existe um produto com este código cadastrado.', 409);
    }

    const novoProduto = await prisma.produto.create({
      data: {
        codProduto: data.codProduto,
        nomeCompleto: data.nomeCompleto,
        nomeAbreviado: data.nomeAbreviado,
        cesta: data.cesta,
        familia: data.familia,
        tipoEmbalagem: data.tipoEmbalagem,
        unidadesEmbalagem: data.unidadesEmbalagem,
        embalagensLastro: data.embalagensLastro,
        embalagensPallet47: data.embalagensPallet47,
        embalagensPallet60: data.embalagensPallet60,
        hl: data.hl,
        idRevenda: data.idRevenda
      }
    });

    return novoProduto;
  }

  // READ - Retorna todos os produtos de uma revenda
  async getAllProdutos(idRevenda: number, ativo?: boolean) {
    const revenda = await prisma.revenda.findUnique({
      where: { id: idRevenda },
    });

    if (!revenda) {
      throw new AppError('Revenda não encontrada', 404);
    }

    const produtos = await prisma.produto.findMany({
      where: {
        OR: [
          { idRevenda: null },
          { idRevenda: idRevenda }
        ],
        ...(ativo !== undefined && { ativo }),
      },
      orderBy: {
        nomeCompleto: 'asc',
      },
    });
    return produtos;
  }

  // READ - Busca um produto pelo código
  async getProdutoByID(codProduto: number) {
    const produto = await prisma.produto.findUnique({
      where: { codProduto },
    });

    if (!produto) {
      throw new AppError('Produto não encontrado.', 404);
    }

    return produto;
  }

  // UPDATE - Atualiza um produto pelo código
  async updateProduto(codProduto: number, data: UpdateProdutoDTO) {
    const produto = await this.getProdutoByID(codProduto);

    if (data.ativo === true) {
      const revenda = await prisma.revenda.findUnique({
        where: { id: produto.idRevenda },
      });

      if (!revenda || !revenda.ativo) {
        throw new AppError(
          'Não é possível ativar um conferente de revenda inativa',
          409
        );
      }
    }
    const produtoAtualizado = await prisma.produto.update({
      where: { codProduto },
      data,
    });

    return produtoAtualizado;
  }

  // DELETE - Inativa um produto pelo código
  async deleteProduto(codProduto: number) {
    const produtoInativado = await this.updateProduto(codProduto, {
      ativo: false,
    });

    return produtoInativado;
  }

  // Função para upload de produtos via CSV
  async uploadProdutosExcel(filePath: string, idRevendaMaster?: number) {
    try {
      const workbook = xlsx.readFile(filePath);
      const nomePrimeiraAba = workbook.SheetNames[0];

      if (!nomePrimeiraAba || !workbook.Sheets) {
        throw new AppError('A planilha Excel não contém abas válidas.', 400);
      }

      const planilha = workbook.Sheets[nomePrimeiraAba];

      if (!planilha) {
        throw new AppError('Não foi possível acessar a primeira aba da planilha.', 400);
      }

      const linhasExcel = xlsx.utils.sheet_to_json<any>(planilha);

      if (linhasExcel.length === 0) {
        throw new AppError('A planilha está vazia.', 400);
      }

      const produtosParaInserir = linhasExcel.map((row, index) => {
        if (!row['Código Abreviado Produto']) {
          throw new AppError(`Erro na linha ${index + 2}: 'Código Abreviado Produto' está vazio.`, 400);
        }

        return {
          codProduto: Number(row['Código Abreviado Produto']),
          nomeCompleto: String(row['Nome Produto'] || '').trim(),
          nomeAbreviado: String(row['Nome Abreviado Produto'] || '').trim(),
          cesta: String(row['Cesta'] || '').trim(),
          familia: String(row['Familia'] || '').trim(),
          tipoEmbalagem: String(row['Embalagem Venda'] || '').trim(),
          unidadesEmbalagem: Number(row['Unidades Embalagem']) || 1,
          embalagensLastro: Number(row['Lastros']) || 0,
          embalagensPallet47: Number(row['Palletização 47']) || 0,
          embalagensPallet60: Number(row['Palletização 60']) || 0,
          hl: Number(row['Fator HL']) || 0.0,
          ativo: true,
          idRevenda: idRevendaMaster || null,
        };
      });

      const resultado = await prisma.produto.createMany({
        data: produtosParaInserir,
        skipDuplicates: true,
      });

      fs.unlinkSync(filePath);

      return {
        message: 'Upload concluído com sucesso',
        linhasLidas: produtosParaInserir.length,
        linhasInseridas: resultado.count,
      };
    } catch (error) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      if (error instanceof AppError) throw error;
      console.error(error);
      throw new AppError('Erro ao processar a planilha Excel. Verifique a formatação das colunas.', 500);
    }
  }
}