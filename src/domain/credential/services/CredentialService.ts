import { v4 as uuidv4 } from 'uuid';

import { CREDENTIAL_NOT_FOUND, INVALID_PASSWORD } from '../../common/utils/errorList';
import { ICipher } from '../../common/interfaces/ICipher';
import { IToken } from '../../common/interfaces/IToken';
import { ICredentialRepository } from '../interfaces/ICredentialRepository';
import { ICredentialService } from '../interfaces/ICredentialService';
import { ICredential } from '../interfaces/ICredential';
import { inject, Lifecycle, registry, scoped } from 'tsyringe';

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'CredentialService', useClass: CredentialService }])
export default class CredentialService implements ICredentialService {
  constructor(
    @inject('Cipher') private readonly _cipher: ICipher,
    @inject('Token') private readonly _token: IToken,
    @inject('CredentialRepository') private readonly _repository: ICredentialRepository,
  ) {}

  private generateToken(userName: string, credentialId: string): Promise<string> {
    return this._token.generate({
      sub: this._cipher.encrypt(userName),
      data: { id: credentialId },
    });
  }

  private validateCredential(credential: ICredential, password: string): void {
    const decryptedPassword = this._cipher.decrypt(credential.password);

    if (decryptedPassword !== password) {
      throw new Error(INVALID_PASSWORD.MESSAGE);
    }
  }

  private async getCredential(userName: string): Promise<ICredential> {
    const credential = await this._repository.findOne(userName);

    if (!credential) {
      throw new Error(CREDENTIAL_NOT_FOUND.MESSAGE); //TODO: ResponseError
    }

    return credential;
  }

  private buildCredentialData(userName: string, password: string): ICredential {
    return {
      id: uuidv4(),
      userName,
      password: this._cipher.encrypt(password),
    };
  }

  async signin(userName: string, password: string): Promise<string> {
    const credential = await this.getCredential(userName);
    this.validateCredential(credential, password);

    return this.generateToken(userName, credential.id);
  }

  async signup(userName: string, password: string): Promise<string> {
    const credential = this.buildCredentialData(userName, password);
    await this._repository.save(credential);

    return this.generateToken(userName, credential.id);
  }
}
