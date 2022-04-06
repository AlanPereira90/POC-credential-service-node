import { stub } from 'sinon';

import { ICredentialRepository } from '../../../src/domain/credential/interfaces/ICredentialRepository';
import CredentialRepository from '../../../src/domain/credential/repositories/CredentialRepository';
import { IDatabase } from '../../../src/domain/common/interfaces/IDatabase';

export default class CredentialRepositoryBuilder {
  static build(database: Partial<IDatabase<any>> = {}): ICredentialRepository {
    const persist = stub();
    const find = stub();

    return new CredentialRepository({ persist, find, ...database });
  }
}
