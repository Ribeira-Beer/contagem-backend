-- AlterTable
ALTER TABLE `produtos` MODIFY `id_revenda` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `produtos` ADD CONSTRAINT `produtos_id_revenda_fkey` FOREIGN KEY (`id_revenda`) REFERENCES `revendas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
