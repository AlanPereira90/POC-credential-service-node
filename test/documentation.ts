import { OpenAPIDocument } from 'easy-api-doc';

import { version } from '../package.json';

export const doc = new OpenAPIDocument(
  './doc/api-reference.yml',
  {
    version,
    title: 'Credential Service API',
    description: 'Credential service rest API definitions',
  },
  [{ url: 'http://localhost:6060', description: 'Credential Service Server' }],
);
