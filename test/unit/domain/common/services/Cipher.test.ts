import faker from '@faker-js/faker';
import { expect } from 'chai';
import { AES, enc } from 'crypto-js';

import { CIPHER } from '../../../../../src/domain/utils/environment';
import Cipher from '../../../../../src/domain/common/services/Cipher';

describe('Cipher', () => {
  describe('encrypt()', () => {
    it('should encrypt a data successfully', () => {
      const data = faker.lorem.word();

      const instance = new Cipher();

      const encrypted = instance.encrypt(data);
      const decrypted = AES.decrypt(encrypted, CIPHER.KEY).toString(enc.Utf8);

      expect(encrypted).to.be.not.equal(data);
      expect(decrypted).to.be.equal(data);
    });
  });

  describe('decrypt()', () => {
    it('should decrypt an encrypted data successfully', () => {
      const data = faker.lorem.word();

      const instance = new Cipher();

      const encrypted = AES.encrypt(data, CIPHER.KEY).toString();
      const decrypted = instance.decrypt(encrypted);

      expect(encrypted).to.be.not.equal(data);
      expect(decrypted).to.be.equal(data);
    });
  });
});
