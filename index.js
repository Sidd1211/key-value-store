const express = require('express');
const Redis = require('ioredis');
const routes = require('./routes');
const config = require('./config');
const { replicateData } = require('./distributed');

const app = express();
const redis = new Redis(config.redis);

app.use(express.json());
app.use('/api', routes);

// app.listen(config.port, () => {
//   console.log(`Server listening on port ${config.port}`);
// });

app.use(express.json()); // Parse incoming JSON requests

// Mount routes at the '/api' path
app.use('/api', routes);

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});