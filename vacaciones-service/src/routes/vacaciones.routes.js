const { Router } = require('express');
const ctrl = require('../controllers/vacaciones.controller');

const router = Router();

router.post('/', ctrl.crear);
router.get('/saldo/:funcionarioId', ctrl.saldo);
router.get('/', ctrl.listar);

module.exports = router;
