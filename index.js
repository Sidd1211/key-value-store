import express from 'express';
import Redis from 'ioredis';
import routes from './routes/kv.js';
import {config} from './config.js';
import { replicateData } from './distributed.js';

const app = express();
const redis = new Redis(config.redis);

app.use(express.json());
app.use('/api', routes);

// app.listen(config.port, () => {
//   console.log(`Server listening on port ${config.port}`);
// });

app.use(express.json()); // Parse incoming JSON requests

// Mount routes at the '/api' path
// app.use('/api', router);

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

export default app;
