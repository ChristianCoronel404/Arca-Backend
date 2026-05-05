const axios = require('axios');

const PERSONAL_URL = process.env.PERSONAL_URL || 'http://localhost:3001';

const getFuncionario = async (id) => {
  try {
    const { data } = await axios.get(`${PERSONAL_URL}/funcionarios/${id}`, { timeout: 3000 });
    return data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const e = new Error('funcionario no encontrado');
      e.status = 400;
      throw e;
    }
    const e = new Error('personal-service no disponible');
    e.status = 503;
    throw e;
  }
};

module.exports = { getFuncionario };
