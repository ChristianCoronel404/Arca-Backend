const prisma = require('../prisma');
const personalClient = require('../services/personal.client');

const TASA_AFP = 0.1271;
const TASA_SALUD = 0.03;

const round2 = (n) => Math.round(n * 100) / 100;

const validarPeriodo = (periodo) => /^\d{4}-(0[1-9]|1[0-2])$/.test(periodo);

const crear = async (req, res) => {
  try {
    const { funcionarioId, periodo, bonos } = req.body;
    if (!funcionarioId || !periodo) {
      return res.status(400).json({ error: 'campos requeridos: funcionarioId, periodo (YYYY-MM)' });
    }
    if (!validarPeriodo(periodo)) {
      return res.status(400).json({ error: 'periodo invalido, formato esperado YYYY-MM' });
    }

    const funcionario = await personalClient.getFuncionario(funcionarioId);

    const sueldoBruto = Number(funcionario.remuneracion);
    if (Number.isNaN(sueldoBruto) || sueldoBruto <= 0) {
      return res.status(400).json({ error: 'remuneracion del funcionario invalida' });
    }

    const bonosNum = bonos === undefined || bonos === null ? 0 : Number(bonos);
    if (Number.isNaN(bonosNum) || bonosNum < 0) {
      return res.status(400).json({ error: 'bonos invalido' });
    }

    const aporteAfp = round2(sueldoBruto * TASA_AFP);
    const aporteSalud = round2(sueldoBruto * TASA_SALUD);
    const sueldoNeto = round2(sueldoBruto - aporteAfp - aporteSalud + bonosNum);

    const boleta = await prisma.boleta.create({
      data: {
        funcionarioId: Number(funcionarioId),
        periodo,
        sueldoBruto,
        aporteAfp,
        aporteSalud,
        bonos: bonosNum,
        sueldoNeto,
      },
    });
    res.status(201).json(boleta);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'ya existe boleta para ese funcionario y periodo' });
    }
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
    if (req.query.periodo) {
      if (!validarPeriodo(req.query.periodo)) {
        return res.status(400).json({ error: 'periodo invalido, formato esperado YYYY-MM' });
      }
      where.periodo = req.query.periodo;
    }
    const boletas = await prisma.boleta.findMany({
      where,
      orderBy: [{ funcionarioId: 'asc' }, { periodo: 'asc' }],
    });
    res.json(boletas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

const obtener = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id invalido' });
    const boleta = await prisma.boleta.findUnique({ where: { id } });
    if (!boleta) return res.status(404).json({ error: 'boleta no encontrada' });
    res.json(boleta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

module.exports = { crear, listar, obtener };
