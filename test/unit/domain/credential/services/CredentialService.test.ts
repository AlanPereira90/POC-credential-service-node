import faker from '@faker-js/faker';
import { expect } from 'chai';
import { stub } from 'sinon';

import { CREDENTIAL_NOT_FOUND, INVALID_PASSWORD } from '../../../../../src/domain/common/utils/errorList';
import CredentialServiceBuilder from '../../../helpers/CredentialServiceBuilder';
import CredentialBuilder from '../../../helpers/CredentialBuilder';

describe('CredentialService', () => {
  describe('signup()', () => {
    it('should create a credential successfully', async () => {
      const credential = CredentialBuilder.build();
      const cryptedUserName = faker.datatype.uuid();
      const cryptedPassword = faker.datatype.uuid();
      const token = faker.datatype.uuid();

      const encrypt = stub().onFirstCall().returns(cryptedPassword).onSecondCall().returns(cryptedUserName);
      const generate = stub().resolves(token);
      const save = stub();
      const instance = CredentialServiceBuilder.build({ encrypt }, { generate }, { save });

      const result = await instance.signup(credential.userName, credential.password);

      expect(result).to.be.equal(token);
      expect(encrypt).to.have.been.calledWith(credential.userName);
      expect(encrypt).to.have.been.calledWith(credential.password);
      expect(generate).to.have.been.calledOnce;
      expect(save).to.have.been.calledOnce;
    });
  });

  describe('signin()', () => {
    it('should signin successfuuly', async () => {
      const credential = CredentialBuilder.build();
      const cryptedUserName = faker.datatype.uuid();
      const cryptedPassword = faker.datatype.uuid();
      const token = faker.datatype.uuid();

      const findOne = stub().resolves({ id: credential.id, userName: credential.userName, password: cryptedPassword });
      const encrypt = stub().returns(cryptedUserName);
      const decrypt = stub().returns(credential.password);
      const generate = stub().resolves(token);

      const instance = CredentialServiceBuilder.build({ encrypt, decrypt }, { generate }, { findOne });

      const result = await instance.signin(credential.userName, credential.password);

      expect(result).to.be.equal(token);
      expect(findOne).to.have.been.calledWith(credential.userName);
      expect(decrypt).to.have.been.calledWith(cryptedPassword);
      expect(encrypt).to.have.been.calledWith(credential.userName);
      expect(generate).to.have.been.calledWith({ sub: cryptedUserName, data: { id: credential.id } });
    });

    it('should fail when credential is not found', async () => {
      const userName = faker.internet.userName();
      const password = faker.internet.password();

      const findOne = stub().resolves();

      const instance = CredentialServiceBuilder.build({}, {}, { findOne });

      const promise = instance.signin(userName, password);

      await expect(promise).to.be.eventually.rejected.with.property('message', CREDENTIAL_NOT_FOUND.MESSAGE);
      expect(findOne).to.have.been.calledWith(userName);
    });

    it('should fail with an invalid password', async () => {
      const userName = faker.internet.userName();
      const password = faker.internet.password();
      const cryptedPassword = faker.datatype.uuid();

      const findOne = stub().resolves({ userName, password: cryptedPassword });
      const decrypt = stub().returns(faker.lorem.word());

      const instance = CredentialServiceBuilder.build({ decrypt }, {}, { findOne });

      const promise = instance.signin(userName, password);

      await expect(promise).to.be.eventually.rejected.with.property('message', INVALID_PASSWORD.MESSAGE);
      expect(findOne).to.have.been.calledWith(userName);
      expect(decrypt).to.have.been.calledWith(cryptedPassword);
    });
  });

  describe('cancel()', () => {
    it('should cancel a credential successfully', async () => {
      const userName = faker.internet.userName();
      const password = faker.internet.password();
      const cryptedPassword = faker.datatype.uuid();

      const findOne = stub().resolves({ userName, password: cryptedPassword });
      const remove = stub();
      const decrypt = stub().returns(password);

      const instance = CredentialServiceBuilder.build({ decrypt }, {}, { findOne, remove });

      const result = await instance.cancel(userName, password);

      expect(result).to.be.undefined;
      expect(findOne).to.have.been.calledWith(userName);
      expect(decrypt).to.have.been.calledWith(cryptedPassword);
      expect(remove).to.have.been.calledWith(userName);
    });

    it('should fail when credential is not found', async () => {
      const userName = faker.internet.userName();
      const password = faker.internet.password();

      const findOne = stub().resolves();

      const instance = CredentialServiceBuilder.build({}, {}, { findOne });

      const promise = instance.cancel(userName, password);

      await expect(promise).to.be.eventually.rejected.with.property('message', CREDENTIAL_NOT_FOUND.MESSAGE);
      expect(findOne).to.have.been.calledWith(userName);
    });

    it('should fail with an invalid password', async () => {
      const userName = faker.internet.userName();
      const password = faker.internet.password();
      const cryptedPassword = faker.datatype.uuid();

      const findOne = stub().resolves({ userName, password: cryptedPassword });
      const decrypt = stub().returns(faker.lorem.word());

      const instance = CredentialServiceBuilder.build({ decrypt }, {}, { findOne });

      const promise = instance.cancel(userName, password);

      await expect(promise).to.be.eventually.rejected.with.property('message', INVALID_PASSWORD.MESSAGE);
      expect(findOne).to.have.been.calledWith(userName);
      expect(decrypt).to.have.been.calledWith(cryptedPassword);
    });
  });
});
