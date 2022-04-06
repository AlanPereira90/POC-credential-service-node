import { stub } from 'sinon';
import { expect } from 'chai';
import faker from '@faker-js/faker';

import CredentialBuilder from '../../../helpers/CredentialBuilder';
import CredentialRepositoryBuilder from '../../../helpers/CredentialRepositoryBuilder';

describe('Credential Repository', () => {
  describe('save()', () => {
    it('shoud save a credential successfully', async () => {
      const credential = CredentialBuilder.build();
      const persist = stub().resolves(credential);

      const instance = CredentialRepositoryBuilder.build({ persist });

      const result = await instance.save(credential);

      expect(result).to.be.deep.equal(credential);
      expect(persist).to.have.been.calledOnceWith(credential.userName, credential);
    });

    it('should fail when database service fails', async () => {
      const credential = CredentialBuilder.build();
      const error = faker.lorem.sentence();
      const persist = stub().rejects(new Error(error));

      const instance = CredentialRepositoryBuilder.build({ persist });

      const promise = instance.save(credential);

      await expect(promise).to.be.eventually.rejected.with.property('message', error);
      expect(persist).to.have.been.calledOnceWith(credential.userName, credential);
    });
  });

  describe('findOne()', () => {
    it('should find a credential successfully', async () => {
      const credential = CredentialBuilder.build();
      const find = stub().resolves(credential);

      const instance = CredentialRepositoryBuilder.build({ find });

      const result = await instance.findOne(credential.userName);

      expect(result).to.be.deep.equal(credential);
      expect(find).to.have.been.calledOnceWith(credential.userName);
    });

    it('should return undefined', async () => {
      const credential = CredentialBuilder.build();
      const find = stub().resolves();

      const instance = CredentialRepositoryBuilder.build({ find });

      const result = await instance.findOne(credential.userName);

      expect(result).to.be.undefined;
      expect(find).to.have.been.calledOnceWith(credential.userName);
    });

    it('should fail when database service fails', async () => {
      const userName = faker.lorem.word();
      const error = faker.lorem.sentence();
      const find = stub().rejects(new Error(error));

      const instance = CredentialRepositoryBuilder.build({ find });

      const promise = instance.findOne(userName);

      await expect(promise).to.be.eventually.rejected.with.property('message', error);
      expect(find).to.have.been.calledOnceWith(userName);
    });
  });
});
