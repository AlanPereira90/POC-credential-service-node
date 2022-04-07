import 'reflect-metadata';
import express from 'express';

import './domain/config/di';
import './application/config/di';

import routes from './application/routes';
import { CONFIG } from './domain/utils/environment';

const app: express.Express = express();

const port: number = CONFIG.PORT;

app.use(routes);

app.listen(port, () => {
  console.info(`Server started on port ${port}`);
});
