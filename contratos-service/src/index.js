const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', routes);

const PORT = process.env.PORT_CONTRATOS || 3003;
app.listen(PORT, () => {
    console.log('contratos-service running on port ' + PORT);
});
