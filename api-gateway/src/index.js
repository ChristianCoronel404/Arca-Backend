const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

app.use('/api/personal', createProxyMiddleware({ target: process.env.PERSONAL_SERVICE_URL, changeOrigin: true }));
app.use('/api/vacaciones', createProxyMiddleware({ target: process.env.VACACIONES_SERVICE_URL, changeOrigin: true }));
app.use('/api/contratos', createProxyMiddleware({ target: process.env.CONTRATOS_SERVICE_URL, changeOrigin: true }));
app.use('/api/pagos', createProxyMiddleware({ target: process.env.PAGOS_SERVICE_URL, changeOrigin: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('API Gateway running on port ' + PORT);
});
