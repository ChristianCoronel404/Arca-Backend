require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

const route = (path, target) =>
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (p) => p.replace(path, ''),
    })
  );

route('/api/personal', process.env.PERSONAL_URL);
route('/api/contratos', process.env.CONTRATOS_URL);
route('/api/vacaciones', process.env.VACACIONES_URL);
route('/api/pagos', process.env.PAGOS_URL);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'gateway' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway en puerto ${PORT}`));
