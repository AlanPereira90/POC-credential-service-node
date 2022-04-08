import { Express } from 'express';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import { BAD_REQUEST, CREATED, FORBIDDEN } from 'http-status';
import { expect } from 'chai';
import { stub, restore } from 'sinon';
import { marshall } from '@aws-sdk/util-dynamodb';

import { App } from '../../src/application/setup/App';
import connection from '../../src/domain/infra/DynamoDB';
import { CREDENTIAL_ALREADY_IN_USE } from '../../src/domain/common/utils/errorList';
import { doc } from '../documentation';

let app: Express;
before(() => {
  app = new App().app;
});

afterEach(() => {
  restore();
});

after(async () => {
  try {
    await doc.writeFile();
  } catch (error) {
    console.error(error);
  }
});

describe('POST /signup', () => {
  it('should return 201 CREATED', (done) => {
    const body = {
      userName: faker.name.firstName(),
      password: faker.internet.password(),
    };

    const getItem = stub(connection, 'getItem').yields(null, {});
    const putItem = stub(connection, 'putItem').yields(null, {});

    supertest(app)
      .post('/signup')
      .set('Content-type', 'application/json')
      .send(body)
      .expect(CREATED)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('accessToken').to.be.a('string');
        expect(getItem).to.be.calledOnce;
        expect(putItem).to.be.calledOnce;

        doc
          .path('/signup')
          .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Credentials'] })
          .fromSuperAgentResponse(res, 'success');

        done();
      });
  });

  it('should return 403 FORBIDDEN when credential is already in use', (done) => {
    const body = {
      userName: faker.name.firstName(),
      password: faker.internet.password(),
    };

    const getItem = stub(connection, 'getItem').yields(null, { Item: marshall(body) });

    supertest(app)
      .post('/signup')
      .set('Content-type', 'application/json')
      .send(body)
      .expect(FORBIDDEN)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', CREDENTIAL_ALREADY_IN_USE.MESSAGE);
        expect(res.body).to.have.property('code', CREDENTIAL_ALREADY_IN_USE.CODE);
        expect(getItem).to.be.calledOnce;

        doc
          .path('/signup')
          .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Credentials'] })
          .fromSuperAgentResponse(res, 'credential is already in use');

        done();
      });
  });

  it('should return 400 BAD_REQUEST given an invalid payload', (done) => {
    const body = {
      user_name: faker.name.firstName(),
      password: faker.internet.password(),
    };

    supertest(app)
      .post('/signup')
      .set('Content-type', 'application/json')
      .send(body)
      .expect(BAD_REQUEST)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', '"userName" is required');

        doc
          .path('/signup')
          .verb('post', { requestBody: { content: body, mediaType: 'application/json' }, tags: ['Credentials'] })
          .fromSuperAgentResponse(res, 'invalid payload');

        done();
      });
  });
});
