/*
  Warnings:

  - A unique constraint covering the columns `[cod_operacao]` on the table `revendas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnpj]` on the table `revendas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `revendas_cod_operacao_cnpj_key` ON `revendas`;

-- CreateIndex
CREATE UNIQUE INDEX `revendas_cod_operacao_key` ON `revendas`(`cod_operacao`);

-- CreateIndex
CREATE UNIQUE INDEX `revendas_cnpj_key` ON `revendas`(`cnpj`);
