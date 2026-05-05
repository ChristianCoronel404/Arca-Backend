const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a ' + 'contratos-service' });
});

module.exports = router;
