import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import responseTime from 'response-time';

import errorHandler from '../middlewares/errorHandler';
import routes from '../routes';
import { CONFIG } from '../../domain/utils/environment';

export class App {
  app: express.Express;

  constructor() {
    this.app = express();

    this.app.use(helmet());
    this.app.use(responseTime());
    this.app.use(cors({ origin: true }));
    this.app.use(bodyParser.json());
    this.app.use(routes);
    this.app.use(errorHandler);
  }

  listen(): void {
    this.app.listen(CONFIG.PORT, () => {
      console.info(`Server is running. Listening on http://localhost:${CONFIG.PORT}`);
      console.debug('Press CTRL+C to exit');
    });
  }
}
