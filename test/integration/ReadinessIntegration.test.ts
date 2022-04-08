import { Express } from 'express';
import supertest from 'supertest';
import { OK } from 'http-status';
import { expect } from 'chai';

import { App } from '../../src/application/setup/App';
import { doc } from '../documentation';

let app: Express;
before(function () {
  app = new App().app;
});

after(async () => {
  try {
    await doc.writeFile();
  } catch (error) {
    console.error(error);
  }
});

describe('GET /status', () => {
  it('should return 200 OK', (done) => {
    supertest(app)
      .get('/status')
      .expect(OK)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', true);

        doc
          .path('/status')
          .verb('get', { tags: ['Readiness'] })
          .fromSuperAgentResponse(res, 'success');

        done();
      });
  });
});
