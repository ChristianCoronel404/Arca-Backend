const prisma = require('../prisma');
const personalClient = require('../services/personal.client');
const { calcularSaldo, aniosCompletos } = require('../services/saldo');

const diffDiasInclusive = (inicio, fin) => {
  const ms = new Date(fin).setHours(0, 0, 0, 0) - new Date(inicio).setHours(0, 0, 0, 0);
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
};

const crear = async (req, res) => {
  try {
    const { funcionarioId, fechaInicio, fechaFin } = req.body;
    if (!funcionarioId || !fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'campos requeridos: funcionarioId, fechaInicio, fechaFin' });
    }
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      return res.status(400).json({ error: 'fechas invalidas' });
    }
    if (fin < inicio) {
      return res.status(400).json({ error: 'fechaFin debe ser >= fechaInicio' });
    }

    const funcionario = await personalClient.getFuncionario(funcionarioId);

    const antiguedad = aniosCompletos(funcionario.fechaIngreso);
    if (antiguedad < 1) {
      return res.status(400).json({
        error: 'el funcionario aun no cumple un anio de antiguedad',
        antiguedadAnios: antiguedad,
      });
    }

    const gestion = inicio.getFullYear();
    const diasSolicitados = diffDiasInclusive(inicio, fin);

    const yaGozadas = await prisma.vacacion.aggregate({
      where: { funcionarioId: Number(funcionarioId), gestion },
      _sum: { diasGozados: true },
    });
    const gozadasEnGestion = yaGozadas._sum.diasGozados || 0;
    const saldo = calcularSaldo(funcionario, gozadasEnGestion);

    if (diasSolicitados > saldo.saldoDisponible) {
      return res.status(400).json({
        error: 'saldo de vacaciones insuficiente',
        diasSolicitados,
        saldoDisponible: saldo.saldoDisponible,
      });
    }

    const vacacion = await prisma.vacacion.create({
      data: {
        funcionarioId: Number(funcionarioId),
        fechaInicio: inicio,
        fechaFin: fin,
        diasGozados: diasSolicitados,
        gestion,
      },
    });
    res.status(201).json(vacacion);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

const saldo = async (req, res) => {
  try {
    const funcionarioId = Number(req.params.funcionarioId);
    if (!Number.isInteger(funcionarioId)) return res.status(400).json({ error: 'funcionarioId invalido' });
    const funcionario = await personalClient.getFuncionario(funcionarioId);
    const gestion = new Date().getFullYear();
    const yaGozadas = await prisma.vacacion.aggregate({
      where: { funcionarioId, gestion },
      _sum: { diasGozados: true },
    });
    const out = calcularSaldo(funcionario, yaGozadas._sum.diasGozados || 0);
    res.json({ funcionarioId, gestion, ...out });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

const listar = async (req, res) => {
  try {
    const where = {};
    if (req.query.funcionarioId) {
      const fid = Number(req.query.funcionarioId);
      if (!Number.isInteger(fid)) return res.status(400).json({ error: 'funcionarioId invalido' });
      where.funcionarioId = fid;
    }
    const vacaciones = await prisma.vacacion.findMany({
      where,
      orderBy: [{ funcionarioId: 'asc' }, { fechaInicio: 'asc' }],
    });
    res.json(vacaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

module.exports = { crear, saldo, listar };
