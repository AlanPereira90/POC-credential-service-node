import faker from '@faker-js/faker';
import { expect } from 'chai';
import { stub } from 'sinon';

import { CREDENTIAL_NOT_FOUND, INVALID_PASSWORD } from '../../../../../src/domain/common/utils/errorList';
import CredentialServiceBuilder from '../../../helpers/CredentialServiceBuilder';

describe('CredentialService', () => {
  describe('signup()', () => {
    it('should create a credential successfully', async () => {
      const userName = faker.internet.userName();
      const password = faker.internet.password();
      const cryptedUserName = faker.datatype.uuid();
      const cryptedPassword = faker.datatype.uuid();
      const token = faker.datatype.uuid();

      const encrypt = stub().onFirstCall().returns(cryptedPassword).onSecondCall().returns(cryptedUserName);
      const generate = stub().resolves(token);
      const save = stub();
      const instance = CredentialServiceBuilder.build({ encrypt }, { generate }, { save });

      const result = await instance.signup(userName, password);

      expect(result).to.be.equal(token);
      expect(encrypt).to.have.been.calledWith(userName);
      expect(encrypt).to.have.been.calledWith(password);
      expect(generate).to.have.been.calledWith(cryptedUserName);
      expect(save).to.have.been.calledWith({ userName, password: cryptedPassword });
    });
  });

  describe('signin()', () => {
    it('should signin successfuuly', async () => {
      const userName = faker.internet.userName();
      const password = faker.internet.password();
      const cryptedUserName = faker.datatype.uuid();
      const cryptedPassword = faker.datatype.uuid();
      const token = faker.datatype.uuid();

      const findOne = stub().resolves({ userName, password: cryptedPassword });
      const encrypt = stub().returns(cryptedUserName);
      const decrypt = stub().returns(password);
      const generate = stub().resolves(token);

      const instance = CredentialServiceBuilder.build({ encrypt, decrypt }, { generate }, { findOne });

      const result = await instance.signin(userName, password);

      expect(result).to.be.equal(token);
      expect(findOne).to.have.been.calledWith(userName);
      expect(decrypt).to.have.been.calledWith(cryptedPassword);
      expect(encrypt).to.have.been.calledWith(userName);
      expect(generate).to.have.been.calledWith(cryptedUserName);
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
});
