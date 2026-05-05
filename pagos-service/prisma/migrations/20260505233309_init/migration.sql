-- CreateTable
CREATE TABLE "Boleta" (
    "id" SERIAL NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "periodo" TEXT NOT NULL,
    "sueldoBruto" DECIMAL(12,2) NOT NULL,
    "aporteAfp" DECIMAL(12,2) NOT NULL,
    "aporteSalud" DECIMAL(12,2) NOT NULL,
    "bonos" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sueldoNeto" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Boleta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Boleta_funcionarioId_periodo_key" ON "Boleta"("funcionarioId", "periodo");
