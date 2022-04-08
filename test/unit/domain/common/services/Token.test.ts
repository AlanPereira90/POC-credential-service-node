import faker from '@faker-js/faker';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';

import { TOKEN } from '../../../../../src/domain/utils/environment';
import Token from '../../../../../src/domain/common/services/Token';

describe('Token', () => {
  describe('generate()', () => {
    it('should generate a token successfully', async () => {
      const content = {
        sub: faker.lorem.word(),
        data: {
          id: faker.datatype.uuid(),
          [faker.lorem.word()]: faker.lorem.word(),
        },
      };

      const instance = new Token();

      const result = await instance.generate(content);

      jwt.verify(result, TOKEN.SECRET, (err, decoded) => {
        expect(err).to.be.null;
        expect(decoded).to.have.property('sub', content.sub);
        expect(decoded).to.have.property('data').to.be.deep.equal(content.data);
      });
    });

    it('should fail given a invalid subject', async () => {
      const content = {
        sub: [],
        data: {
          id: faker.datatype.uuid(),
          [faker.lorem.word()]: faker.lorem.word(),
        },
      };

      const instance = new Token();

      // @ts-ignore
      const promise = instance.generate(content);

      await expect(promise).to.be.eventually.rejected.with.property('message', '"subject" must be a string');
    });
  });

  describe('verify()', () => {
    it('should validate a token successfully', async () => {
      const content = {
        sub: faker.lorem.word(),
        data: {
          id: faker.datatype.uuid(),
          [faker.lorem.word()]: faker.lorem.word(),
        },
      };

      const instance = new Token();

      const token = await instance.generate(content);

      const result = await instance.verify(token);

      expect(result).to.be.deep.equal(content);
    });

    it('should fail given an invalid token', async () => {
      const token = faker.lorem.word();

      const instance = new Token();

      const promise = instance.verify(token);

      await expect(promise).to.be.eventually.rejected.with.property('message', 'jwt malformed');
    });
  });
});
