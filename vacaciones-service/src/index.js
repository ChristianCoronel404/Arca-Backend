require('dotenv').config();
const express = require('express');
const cors = require('cors');

const vacacionesRoutes = require('./routes/vacaciones.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'vacaciones' }));
app.use('/vacaciones', vacacionesRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`vacaciones-service en puerto ${PORT}`));
