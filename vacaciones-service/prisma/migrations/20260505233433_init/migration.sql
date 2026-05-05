-- CreateTable
CREATE TABLE "Vacacion" (
    "id" SERIAL NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "diasGozados" INTEGER NOT NULL,
    "gestion" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vacacion_pkey" PRIMARY KEY ("id")
);
