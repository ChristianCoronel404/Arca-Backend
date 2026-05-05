const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const funcionarios = [
  {
    ci: '12345678',
    nombre: 'Juan',
    apellido: 'Perez',
    fechaIngreso: new Date('2023-01-15'),
    area: 'Operaciones',
    cargo: 'Analista Senior',
    remuneracion: 8500.0,
  },
  {
    ci: '87654321',
    nombre: 'Ana',
    apellido: 'Mendoza',
    fechaIngreso: new Date('2025-11-01'),
    area: 'Riesgos',
    cargo: 'Asistente',
    remuneracion: 4200.0,
  },
  {
    ci: '11223344',
    nombre: 'Carlos',
    apellido: 'Rojas',
    fechaIngreso: new Date('2024-03-10'),
    area: 'Tecnologia',
    cargo: 'Desarrollador',
    remuneracion: 7000.0,
  },
];

async function main() {
  for (const f of funcionarios) {
    const out = await prisma.funcionario.upsert({
      where: { ci: f.ci },
      update: {},
      create: f,
    });
    console.log(`seed: ${out.ci} -> ${out.nombre} ${out.apellido} (id ${out.id})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
