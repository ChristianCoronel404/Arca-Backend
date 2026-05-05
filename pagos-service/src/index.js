require('dotenv').config();
const express = require('express');
const cors = require('cors');

const boletasRoutes = require('./routes/boletas.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'pagos' }));
app.use('/boletas', boletasRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`pagos-service en puerto ${PORT}`));
