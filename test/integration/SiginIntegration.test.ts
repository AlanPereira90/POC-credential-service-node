import { Express } from 'express';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import { FORBIDDEN, NOT_FOUND, OK } from 'http-status';
import { expect } from 'chai';
import { stub } from 'sinon';
import { marshall } from '@aws-sdk/util-dynamodb';
import { AES } from 'crypto-js';

import { App } from '../../src/application/setup/App';
import connection from '../../src/domain/infra/DynamoDB';
import { CREDENTIAL_NOT_FOUND, INVALID_PASSWORD } from '../../src/domain/common/utils/errorList';
import { CIPHER } from '../../src/domain/utils/environment';

let app: Express;
before(function () {
  app = new App().app;
});

describe('POST /signin', () => {
  it('should return 200 OK', (done) => {
    const body = {
      userName: faker.name.firstName(),
      password: faker.internet.password(),
    };

    const getItem = stub(connection, 'getItem').yields(null, {
      Item: marshall({ userName: body.userName, password: AES.encrypt(body.password, CIPHER.KEY).toString() }),
    });

    supertest(app)
      .post('/signin')
      .set('Content-type', 'application/json')
      .send(body)
      .expect(OK)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('accessToken').to.be.a('string');
        expect(getItem).to.be.calledOnce;

        done();
      });
  });

  it('should return 403 FORBIDDEN when password is invalid', (done) => {
    const body = {
      userName: faker.name.firstName(),
      password: faker.internet.password(),
    };

    const getItem = stub(connection, 'getItem').yields(null, { Item: marshall(body) });

    supertest(app)
      .post('/signin')
      .set('Content-type', 'application/json')
      .send(body)
      .expect(FORBIDDEN)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', INVALID_PASSWORD.MESSAGE);
        expect(res.body).to.have.property('code', INVALID_PASSWORD.CODE);
        expect(getItem).to.be.calledOnce;

        done();
      });
  });

  it('should return 404 NOT_FOUND when credential does not exists', (done) => {
    const body = {
      userName: faker.name.firstName(),
      password: faker.internet.password(),
    };

    const getItem = stub(connection, 'getItem').yields(null, {});

    supertest(app)
      .post('/signin')
      .set('Content-type', 'application/json')
      .send(body)
      .expect(NOT_FOUND)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message', CREDENTIAL_NOT_FOUND.MESSAGE);
        expect(res.body).to.have.property('code', CREDENTIAL_NOT_FOUND.CODE);
        expect(getItem).to.be.calledOnce;

        done();
      });
  });
});
