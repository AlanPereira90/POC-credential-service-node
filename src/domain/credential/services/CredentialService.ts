import { ICipher } from '../../common/interfaces/ICipher';
import { IToken } from '../../common/interfaces/IToken';
import { ICredentialRepository } from '../interfaces/ICredentialRepository';
import { ICredentialService } from '../interfaces/ICredentialService';

export default class CredentialService implements ICredentialService {
  constructor(
    private readonly _cipher: ICipher,
    private readonly _token: IToken,
    private readonly _repository: ICredentialRepository,
  ) {}

  async signup(userName: string, password: string): Promise<string> {
    const cryptedUserName = this._cipher.encrypt(userName);
    const cryptedPassword = this._cipher.encrypt(password);

    await this._repository.save({ userName, password: cryptedPassword });

    return this._token.generate(cryptedUserName);
  }
}
