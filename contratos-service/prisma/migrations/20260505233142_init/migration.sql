-- CreateTable
CREATE TABLE "Contrato" (
    "id" SERIAL NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "salario" DECIMAL(12,2) NOT NULL,
    "periodoPrueba" INTEGER NOT NULL,
    "template" TEXT NOT NULL DEFAULT 'default',
    "documento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);
