import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';

import './domain/config/di';
import './application/config/di';

import routes from './application/routes';
import { CONFIG } from './domain/utils/environment';
import errorHandler from './application/middlewares/errorHandler';

const app: express.Express = express();

const port: number = CONFIG.PORT;

app.use(bodyParser.json());
app.use(routes);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server started on port ${port}`);
});
