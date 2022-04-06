import { stub } from 'sinon';

import Database from '../../../src/domain/common/services/Database';
import { IDatabase } from '../../../src/domain/common/interfaces/IDatabase';
import { IDyanamoDBConnection } from '../../../src/domain/infra/interfaces/IDyanamoDBConnection';

export default class DatabaseBuilder {
  public static build(connection: Partial<IDyanamoDBConnection> = {}): IDatabase<any> {
    const putItem = stub();
    const getItem = stub();

    return new Database({ putItem, getItem, ...connection });
  }
}
