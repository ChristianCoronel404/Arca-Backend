require('dotenv').config();
const express = require('express');
const cors = require('cors');

const funcionariosRoutes = require('./routes/funcionarios.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'personal' }));
app.use('/funcionarios', funcionariosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`personal-service en puerto ${PORT}`));
