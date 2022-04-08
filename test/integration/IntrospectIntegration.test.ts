import { Express } from 'express';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { expect } from 'chai';
import Jwt from 'jsonwebtoken';

import { App } from '../../src/application/setup/App';
import { TOKEN } from '../../src/domain/utils/environment';
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

describe('POST /introspect', () => {
  it('should return 200 OK', (done) => {
    const content = {
      sub: faker.name.firstName(),
      data: {
        id: faker.datatype.uuid(),
        foo: 'bar',
      },
    };

    Jwt.sign({ data: content.data }, TOKEN.SECRET, { subject: content.sub, expiresIn: '8 h' }, (_err, encoded) => {
      const body = {
        accessToken: encoded,
      };

      supertest(app)
        .post('/introspect')
        .set('Content-type', 'application/json')
        .send(body)
        .expect(OK)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('credentialId', content.data.id);

          doc
            .path('/introspect')
            .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Credentials'] })
            .fromSuperAgentResponse(res, 'success');

          done();
        });
    });
  });

  it('should return 500 INTERNAL_SERVER_ERROR given a expired token', (done) => {
    const content = {
      sub: faker.name.firstName(),
      data: {
        id: faker.datatype.uuid(),
        foo: 'bar',
      },
    };

    Jwt.sign({ data: content.data }, TOKEN.SECRET, { subject: content.sub, expiresIn: '0 s' }, (_err, encoded) => {
      const body = {
        accessToken: encoded,
      };

      supertest(app)
        .post('/introspect')
        .set('Content-type', 'application/json')
        .send(body)
        .expect(INTERNAL_SERVER_ERROR)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'jwt expired');

          doc
            .path('/introspect')
            .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Credentials'] })
            .fromSuperAgentResponse(res, 'expired token');

          done();
        });
    });
  });

  it('should return 500 INTERNAL_SERVER_ERROR given an invalid token', (done) => {
    const body = {
      accessToken: faker.datatype.uuid(),
    };

    supertest(app)
      .post('/introspect')
      .set('Content-type', 'application/json')
      .send(body)
      .expect(INTERNAL_SERVER_ERROR)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', 'jwt malformed');

        doc
          .path('/introspect')
          .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Credentials'] })
          .fromSuperAgentResponse(res, 'invalid token');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given an invalid payload', (done) => {
    const body = {
      access_token: faker.datatype.uuid(),
    };

    supertest(app)
      .post('/introspect')
      .set('Content-type', 'application/json')
      .send(body)
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', '"accessToken" is required');

        done();
      });
  });
});
