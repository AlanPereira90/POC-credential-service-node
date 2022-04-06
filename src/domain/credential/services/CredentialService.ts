import { CREDENTIAL_NOT_FOUND, INVALID_PASSWORD } from '../../common/utils/errorList';
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

  private generateToken(userName: string): Promise<string> {
    return this._token.generate(this._cipher.encrypt(userName));
  }

  async signin(userName: string, password: string): Promise<string> {
    const credential = await this._repository.findOne(userName);

    if (!credential) {
      throw new Error(CREDENTIAL_NOT_FOUND.MESSAGE); //TODO: ResponseError
    }

    const decryptedPassword = this._cipher.decrypt(credential.password);

    if (decryptedPassword !== password) {
      throw new Error(INVALID_PASSWORD.MESSAGE);
    }

    return this.generateToken(userName);
  }

  async signup(userName: string, password: string): Promise<string> {
    const cryptedPassword = this._cipher.encrypt(password);
    await this._repository.save({ userName, password: cryptedPassword });

    return this.generateToken(userName);
  }
}
