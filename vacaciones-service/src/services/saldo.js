const DIAS_POR_GESTION = 15;

const aniosCompletos = (fechaIngreso, ahora = new Date()) => {
  const ingreso = new Date(fechaIngreso);
  let anios = ahora.getFullYear() - ingreso.getFullYear();
  const m = ahora.getMonth() - ingreso.getMonth();
  if (m < 0 || (m === 0 && ahora.getDate() < ingreso.getDate())) anios--;
  return anios;
};

const calcularSaldo = (funcionario, vacacionesGozadasEnGestion, ahora = new Date()) => {
  const antiguedad = aniosCompletos(funcionario.fechaIngreso, ahora);
  const gestionesCompletas = Math.max(antiguedad, 0);
  const diasOtorgados = gestionesCompletas * DIAS_POR_GESTION;
  const diasGozados = vacacionesGozadasEnGestion;
  const saldoDisponible = diasOtorgados - diasGozados;
  return {
    antiguedadAnios: antiguedad,
    gestionesCompletas,
    diasOtorgados,
    diasGozados,
    saldoDisponible,
  };
};

module.exports = { calcularSaldo, aniosCompletos, DIAS_POR_GESTION };
