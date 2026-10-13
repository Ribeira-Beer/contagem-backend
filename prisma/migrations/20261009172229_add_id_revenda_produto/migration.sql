/*
  Warnings:

  - Added the required column `id_revenda` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `id_revenda` INTEGER NOT NULL;
