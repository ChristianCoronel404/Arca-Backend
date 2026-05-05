const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a ' + 'pagos-service' });
});

module.exports = router;
