import faker from '@faker-js/faker';
import { expect } from 'chai';
import { stub } from 'sinon';

import DynamoDBObjectBuilder from '../../../helpers/DynamoDBObjectBuilder';
import DatabaseBuilder from '../../../helpers/DatabaseBuilder';

describe('Database', () => {
  describe('persist()', () => {
    it('should call the persist method of the underlying database', async () => {
      const pk = faker.lorem.word();
      const entity = {
        id: faker.datatype.uuid(),
        [faker.lorem.word()]: faker.lorem.word(),
      };

      const putItem = stub().yields(null, {});

      const instance = DatabaseBuilder.build({ putItem });

      const result = await instance.persist(pk, entity);

      expect(result).to.be.deep.equal(entity);
      expect(putItem).to.have.been.calledOnce;
    });
  });

  describe('find()', () => {
    it('should find an entity', async () => {
      const pk = faker.lorem.word();
      const entity = {
        id: faker.datatype.uuid(),
        [faker.lorem.word()]: faker.lorem.word(),
      };

      const getItem = stub().yields(null, DynamoDBObjectBuilder.buildGetItemResponse(entity));

      const instance = DatabaseBuilder.build({ getItem });

      const result = await instance.find(pk);

      expect(result).to.be.deep.equal(entity);
      expect(getItem).to.have.been.calledOnce;
    });
  });
});
