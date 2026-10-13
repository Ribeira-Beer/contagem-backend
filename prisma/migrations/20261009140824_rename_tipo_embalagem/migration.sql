/*
  Warnings:

  - You are about to drop the column `embalagem` on the `produtos` table. All the data in the column will be lost.
  - Added the required column `tipoEmbalagem` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produtos` DROP COLUMN `embalagem`,
    ADD COLUMN `tipoEmbalagem` VARCHAR(60) NOT NULL;
