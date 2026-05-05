const { Router } = require('express');
const ctrl = require('../controllers/contratos.controller');

const router = Router();

router.post('/', ctrl.crear);
router.get('/', ctrl.listar);
router.get('/:id/documento', ctrl.documento);
router.get('/:id', ctrl.obtener);

module.exports = router;
