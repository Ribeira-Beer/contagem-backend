/*
  Warnings:

  - You are about to drop the column `data_contagem` on the `contagens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `contagens` DROP COLUMN `data_contagem`,
    ADD COLUMN `data_abertura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `data_finalizacao` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `itens_contagem` ADD COLUMN `data_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
