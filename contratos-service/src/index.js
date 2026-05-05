require('dotenv').config();
const express = require('express');
const cors = require('cors');

const contratosRoutes = require('./routes/contratos.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'contratos' }));
app.use('/contratos', contratosRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`contratos-service en puerto ${PORT}`));
