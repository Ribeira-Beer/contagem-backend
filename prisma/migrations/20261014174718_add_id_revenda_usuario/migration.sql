-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "id_revenda" INTEGER;

-- CreateIndex
CREATE INDEX "usuarios_id_revenda_idx" ON "usuarios"("id_revenda");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "fk_usuarios_revenda" FOREIGN KEY ("id_revenda") REFERENCES "revendas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
