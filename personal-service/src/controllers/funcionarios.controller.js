const prisma = require('../prisma');

const parseRemuneracion = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) {
    const err = new Error('remuneracion invalida');
    err.status = 400;
    throw err;
  }
  return num;
};

const parseFecha = (value) => {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    const err = new Error('fechaIngreso invalida');
    err.status = 400;
    throw err;
  }
  return d;
};

const crear = async (req, res) => {
  try {
    const { ci, nombre, apellido, fechaIngreso, area, cargo, remuneracion } = req.body;
    if (!ci || !nombre || !apellido || !fechaIngreso || !area || !cargo || remuneracion === undefined) {
      return res.status(400).json({ error: 'campos requeridos: ci, nombre, apellido, fechaIngreso, area, cargo, remuneracion' });
    }
    const funcionario = await prisma.funcionario.create({
      data: {
        ci: String(ci),
        nombre,
        apellido,
        fechaIngreso: parseFecha(fechaIngreso),
        area,
        cargo,
        remuneracion: parseRemuneracion(remuneracion),
      },
    });
    res.status(201).json(funcionario);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'ci ya registrado' });
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

const listar = async (req, res) => {
  try {
    const todos = req.query.todos === 'true';
    const funcionarios = await prisma.funcionario.findMany({
      where: todos ? {} : { activo: true },
      orderBy: { id: 'asc' },
    });
    res.json(funcionarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

const obtener = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id invalido' });
    const funcionario = await prisma.funcionario.findUnique({ where: { id } });
    if (!funcionario) return res.status(404).json({ error: 'funcionario no encontrado' });
    res.json(funcionario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

const actualizar = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id invalido' });
    const { area, cargo, remuneracion } = req.body;
    const data = {};
    if (area !== undefined) data.area = area;
    if (cargo !== undefined) data.cargo = cargo;
    if (remuneracion !== undefined) data.remuneracion = parseRemuneracion(remuneracion);
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'enviar al menos uno: area, cargo, remuneracion' });
    }
    const funcionario = await prisma.funcionario.update({ where: { id }, data });
    res.json(funcionario);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'funcionario no encontrado' });
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

const baja = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id invalido' });
    const funcionario = await prisma.funcionario.update({
      where: { id },
      data: { activo: false },
    });
    res.json(funcionario);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'funcionario no encontrado' });
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
};

module.exports = { crear, listar, obtener, actualizar, baja };
