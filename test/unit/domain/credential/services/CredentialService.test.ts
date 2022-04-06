import faker from '@faker-js/faker';
import { expect } from 'chai';
import { stub } from 'sinon';

import CredentialServiceBuilder from '../../../helpers/CredentialServiceBuilder';

describe('CredentialService', () => {
  describe('signup()', () => {
    it('should create a credential successfully', async () => {
      const userName = faker.internet.userName();
      const password = faker.internet.password();
      const cryptedUserName = faker.datatype.uuid();
      const cryptedPassword = faker.datatype.uuid();
      const token = faker.datatype.uuid();

      const encrypt = stub().onFirstCall().returns(cryptedUserName).onSecondCall().returns(cryptedPassword);
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
});
