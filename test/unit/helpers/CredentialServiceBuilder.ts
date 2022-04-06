import { stub } from 'sinon';

import { ICipher } from '../../../src/domain/common/interfaces/ICipher';
import { IToken } from '../../../src/domain/common/interfaces/IToken';
import { ICredentialRepository } from '../../../src/domain/credential/interfaces/ICredentialRepository';
import { ICredentialService } from '../../../src/domain/credential/interfaces/ICredentialService';
import CredentialService from '../../../src/domain/credential/services/CredentialService';

export default class CredentialServiceBuilder {
  public static build(
    cipher: Partial<ICipher> = {},
    token: Partial<IToken> = {},
    repository: Partial<ICredentialRepository> = {},
  ): ICredentialService {
    const encrypt = stub();
    const decrypt = stub();

    const generate = stub();

    const save = stub();
    const findOne = stub();
    const remove = stub();

    return new CredentialService(
      { encrypt, decrypt, ...cipher },
      { generate, ...token },
      { save, findOne, remove, ...repository },
    );
  }
}
