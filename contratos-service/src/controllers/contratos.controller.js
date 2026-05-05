const prisma = require('../prisma');
const { render } = require('../templates/default');
const personalClient = require('../services/personal.client');

const formatFecha = (d) => new Date(d).toISOString().slice(0, 10);

const crear = async (req, res) => {
  try {
    const { funcionarioId, salario, periodoPrueba, template } = req.body;
    if (!funcionarioId || salario === undefined || periodoPrueba === undefined) {
      return res.status(400).json({ error: 'campos requeridos: funcionarioId, salario, periodoPrueba' });
    }
    const funcionario = await personalClient.getFuncionario(funcionarioId);

    const salarioNum = Number(salario);
    const periodoNum = Number(periodoPrueba);
    if (Number.isNaN(salarioNum) || salarioNum <= 0) {
      return res.status(400).json({ error: 'salario invalido' });
    }
    if (!Number.isInteger(periodoNum) || periodoNum < 0) {
      return res.status(400).json({ error: 'periodoPrueba debe ser un entero >= 0' });
    }

    const documento = render(template || 'default', {
      nombre: funcionario.nombre,
      apellido: funcionario.apellido,
      ci: funcionario.ci,
      salario: salarioNum.toFixed(2),
      fechaIngreso: formatFecha(funcionario.fechaIngreso),
      periodoPrueba: periodoNum,
    });

    const contrato = await prisma.contrato.create({
      data: {
        funcionarioId: Number(funcionarioId),
        fechaIngreso: new Date(funcionario.fechaIngreso),
        salario: salarioNum,
        periodoPrueba: periodoNum,
        template: template || 'default',
        documento,
      },
    });
    res.status(201).json(contrato);
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
    const contratos = await prisma.contrato.findMany({ where, orderBy: { id: 'asc' } });
    res.json(contratos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

const obtener = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id invalido' });
    const contrato = await prisma.contrato.findUnique({ where: { id } });
    if (!contrato) return res.status(404).json({ error: 'contrato no encontrado' });
    res.json(contrato);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

const documento = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id invalido' });
    const contrato = await prisma.contrato.findUnique({ where: { id } });
    if (!contrato) return res.status(404).json({ error: 'contrato no encontrado' });
    res.type('text/plain').send(contrato.documento);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

module.exports = { crear, listar, obtener, documento };
