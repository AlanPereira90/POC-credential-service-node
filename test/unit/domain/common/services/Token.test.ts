import faker from '@faker-js/faker';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';

import { TOKEN } from '../../../../../src/domain/utils/environment';
import Token from '../../../../../src/domain/common/services/Token';

describe('Token', () => {
  describe('generate()', () => {
    it('should generate a token successfully', async () => {
      const data = {
        [faker.lorem.word()]: faker.lorem.word(),
      };
      const subject = faker.lorem.word();

      const instance = new Token();

      const result = await instance.generate(subject, data);

      jwt.verify(result, TOKEN.SECRET, (err, decoded) => {
        expect(err).to.be.null;
        expect(decoded).to.have.property('sub', subject);
        expect(decoded).to.have.property('data').to.be.deep.equal(data);
      });
    });
  });

  describe('verify()', () => {
    it('should validate a token successfully', async () => {
      const data = {
        [faker.lorem.word()]: faker.lorem.word(),
      };
      const subject = faker.lorem.word();

      const instance = new Token();

      const token = await instance.generate(subject, data);

      const result = await instance.verify(token);

      expect(result).to.be.true;
    });
  });
});
