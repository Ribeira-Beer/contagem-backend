-- CreateTable
CREATE TABLE `revendas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_operacao` INTEGER NOT NULL,
    `nome` VARCHAR(150) NOT NULL,
    `cnpj` VARCHAR(18) NOT NULL,
    `cep` VARCHAR(9) NOT NULL,
    `estado` VARCHAR(2) NOT NULL,
    `cidade` VARCHAR(100) NOT NULL,
    `bairro` VARCHAR(100) NOT NULL,
    `logradouro` VARCHAR(150) NOT NULL,
    `numero` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `revendas_cod_operacao_cnpj_key`(`cod_operacao`, `cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `areas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `id_revenda` INTEGER NOT NULL,

    UNIQUE INDEX `areas_nome_id_revenda_key`(`nome`, `id_revenda`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos` (
    `cod_produto` INTEGER NOT NULL,
    `nome_completo` VARCHAR(255) NOT NULL,
    `nome_abreviado` VARCHAR(100) NOT NULL,
    `cesta` VARCHAR(60) NOT NULL,
    `familia` VARCHAR(60) NOT NULL,
    `embalagem` VARCHAR(60) NOT NULL,
    `unidades_embalagem` INTEGER NOT NULL,
    `embalagens_lastro` INTEGER NOT NULL DEFAULT 0,
    `embalagens_pallet_47` INTEGER NOT NULL DEFAULT 0,
    `embalagens_pallet_60` INTEGER NOT NULL DEFAULT 0,
    `hl` DECIMAL(10, 4) NOT NULL,

    PRIMARY KEY (`cod_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conferentes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `id_revenda` INTEGER NOT NULL,

    UNIQUE INDEX `conferentes_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contagens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_conferente` INTEGER NOT NULL,
    `data_contagem` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(20) NOT NULL DEFAULT 'EM_ANDAMENTO',
    `id_area` INTEGER NOT NULL,
    `id_revenda` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itens_contagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_contagem` INTEGER NOT NULL,
    `cod_produto` INTEGER NOT NULL,
    `pallets` INTEGER NOT NULL DEFAULT 0,
    `lastros` INTEGER NOT NULL DEFAULT 0,
    `unidades` INTEGER NOT NULL DEFAULT 0,
    `avulsas` INTEGER NOT NULL DEFAULT 0,
    `id_revenda` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `areas` ADD CONSTRAINT `fk_areas_revenda` FOREIGN KEY (`id_revenda`) REFERENCES `revendas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conferentes` ADD CONSTRAINT `fk_conferentes_revenda` FOREIGN KEY (`id_revenda`) REFERENCES `revendas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contagens` ADD CONSTRAINT `fk_contagens_conferente` FOREIGN KEY (`id_conferente`) REFERENCES `conferentes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contagens` ADD CONSTRAINT `fk_contagens_area` FOREIGN KEY (`id_area`) REFERENCES `areas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contagens` ADD CONSTRAINT `fk_contagens_revenda` FOREIGN KEY (`id_revenda`) REFERENCES `revendas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_contagem` ADD CONSTRAINT `fk_itens_contagem` FOREIGN KEY (`id_contagem`) REFERENCES `contagens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_contagem` ADD CONSTRAINT `fk_itens_produto` FOREIGN KEY (`cod_produto`) REFERENCES `produtos`(`cod_produto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itens_contagem` ADD CONSTRAINT `fk_itens_revenda` FOREIGN KEY (`id_revenda`) REFERENCES `revendas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
