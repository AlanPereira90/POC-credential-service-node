import faker from '@faker-js/faker';

import { ICredential } from '../../../src/domain/credential/interfaces/ICredential';

export default class CredentialBuilder {
  static build(fields: Partial<ICredential> = {}): ICredential {
    return {
      userName: faker.internet.userName(),
      password: faker.internet.password(),
      ...fields,
    };
  }
}
