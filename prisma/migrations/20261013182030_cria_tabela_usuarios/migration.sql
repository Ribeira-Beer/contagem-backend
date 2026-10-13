/*
  Warnings:

  - A unique constraint covering the columns `[id_usuario]` on the table `conferentes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `conferentes` ADD COLUMN `id_usuario` INTEGER NULL;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(150) NULL,
    `cpf` VARCHAR(14) NULL,
    `senha` VARCHAR(255) NOT NULL,
    `tipo` VARCHAR(20) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `conferentes_id_usuario_key` ON `conferentes`(`id_usuario`);

-- AddForeignKey
ALTER TABLE `conferentes` ADD CONSTRAINT `fk_conferentes_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
