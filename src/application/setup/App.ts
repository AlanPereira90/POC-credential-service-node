import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import responseTime from 'response-time';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import errorHandler from '../middlewares/errorHandler';
import routes from '../routes';
import { CONFIG, PROD } from '../../domain/utils/environment';

export class App {
  app: express.Express;

  constructor() {
    this.app = express();

    if (!PROD) {
      this.app.use(morgan('dev'));
      const swaggerDocument = YAML.load('doc/api-reference.yml');
      this.app.use('/api-docs', swaggerUi.serve);
      this.app.get('/api-docs', swaggerUi.setup(swaggerDocument));
    }

    this.app.use(helmet());
    this.app.use(responseTime());
    this.app.use(cors({ origin: true }));
    this.app.use(bodyParser.json());
    this.app.use(routes);
    this.app.use(errorHandler);
  }

  listen(): void {
    this.app.listen(CONFIG.PORT, () => {
      console.info(
        `Server is running. Listening on port ${CONFIG.PORT}\nDocumentation available on SERVER_URL:${CONFIG.PORT}/api-docs`,
      );
      console.debug('Press CTRL+C to exit');
    });
  }
}
