-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(150),
    "cpf" VARCHAR(14),
    "senha" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revendas" (
    "id" SERIAL NOT NULL,
    "cod_operacao" INTEGER NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "cnpj" VARCHAR(18) NOT NULL,
    "cep" VARCHAR(9) NOT NULL,
    "estado" VARCHAR(2) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "bairro" VARCHAR(100) NOT NULL,
    "logradouro" VARCHAR(150) NOT NULL,
    "numero" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "revendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "id_revenda" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "cod_produto" INTEGER NOT NULL,
    "nome_completo" VARCHAR(255) NOT NULL,
    "nome_abreviado" VARCHAR(100) NOT NULL,
    "cesta" VARCHAR(60) NOT NULL,
    "familia" VARCHAR(60) NOT NULL,
    "unidades_embalagem" INTEGER NOT NULL,
    "embalagens_lastro" INTEGER NOT NULL DEFAULT 0,
    "embalagens_pallet_47" INTEGER NOT NULL DEFAULT 0,
    "embalagens_pallet_60" INTEGER NOT NULL DEFAULT 0,
    "hl" DECIMAL(10,4) NOT NULL,
    "tipoEmbalagem" VARCHAR(60) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "id_revenda" INTEGER,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("cod_produto")
);

-- CreateTable
CREATE TABLE "conferentes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "id_revenda" INTEGER NOT NULL,
    "id_usuario" INTEGER,

    CONSTRAINT "conferentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contagens" (
    "id" SERIAL NOT NULL,
    "id_conferente" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'EM_ANDAMENTO',
    "id_area" INTEGER NOT NULL,
    "id_revenda" INTEGER NOT NULL,
    "data_abertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_finalizacao" TIMESTAMP(3),

    CONSTRAINT "contagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_contagem" (
    "id" SERIAL NOT NULL,
    "id_contagem" INTEGER NOT NULL,
    "cod_produto" INTEGER NOT NULL,
    "pallets" INTEGER NOT NULL DEFAULT 0,
    "lastros" INTEGER NOT NULL DEFAULT 0,
    "unidades" INTEGER NOT NULL DEFAULT 0,
    "avulsas" INTEGER NOT NULL DEFAULT 0,
    "id_revenda" INTEGER NOT NULL,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_contagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "revendas_cod_operacao_key" ON "revendas"("cod_operacao");

-- CreateIndex
CREATE UNIQUE INDEX "revendas_cnpj_key" ON "revendas"("cnpj");

-- CreateIndex
CREATE INDEX "areas_id_revenda_idx" ON "areas"("id_revenda");

-- CreateIndex
CREATE UNIQUE INDEX "areas_nome_id_revenda_key" ON "areas"("nome", "id_revenda");

-- CreateIndex
CREATE INDEX "produtos_id_revenda_idx" ON "produtos"("id_revenda");

-- CreateIndex
CREATE UNIQUE INDEX "conferentes_cpf_key" ON "conferentes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "conferentes_id_usuario_key" ON "conferentes"("id_usuario");

-- CreateIndex
CREATE INDEX "conferentes_id_revenda_idx" ON "conferentes"("id_revenda");

-- CreateIndex
CREATE INDEX "contagens_id_area_idx" ON "contagens"("id_area");

-- CreateIndex
CREATE INDEX "contagens_id_conferente_idx" ON "contagens"("id_conferente");

-- CreateIndex
CREATE INDEX "contagens_id_revenda_idx" ON "contagens"("id_revenda");

-- CreateIndex
CREATE INDEX "itens_contagem_id_contagem_idx" ON "itens_contagem"("id_contagem");

-- CreateIndex
CREATE INDEX "itens_contagem_cod_produto_idx" ON "itens_contagem"("cod_produto");

-- CreateIndex
CREATE INDEX "itens_contagem_id_revenda_idx" ON "itens_contagem"("id_revenda");

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "fk_areas_revenda" FOREIGN KEY ("id_revenda") REFERENCES "revendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "fk_produtos_revenda" FOREIGN KEY ("id_revenda") REFERENCES "revendas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conferentes" ADD CONSTRAINT "fk_conferentes_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conferentes" ADD CONSTRAINT "fk_conferentes_revenda" FOREIGN KEY ("id_revenda") REFERENCES "revendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contagens" ADD CONSTRAINT "fk_contagens_area" FOREIGN KEY ("id_area") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contagens" ADD CONSTRAINT "fk_contagens_conferente" FOREIGN KEY ("id_conferente") REFERENCES "conferentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contagens" ADD CONSTRAINT "fk_contagens_revenda" FOREIGN KEY ("id_revenda") REFERENCES "revendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_contagem" ADD CONSTRAINT "fk_itens_contagem" FOREIGN KEY ("id_contagem") REFERENCES "contagens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_contagem" ADD CONSTRAINT "fk_itens_produto" FOREIGN KEY ("cod_produto") REFERENCES "produtos"("cod_produto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_contagem" ADD CONSTRAINT "fk_itens_revenda" FOREIGN KEY ("id_revenda") REFERENCES "revendas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
