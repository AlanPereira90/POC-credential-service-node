import { IDatabase } from 'src/domain/common/interfaces/IDatabase';
import { ICredential } from '../interfaces/ICredential';
import { ICredentialRepository } from '../interfaces/ICredentialRepository';

export default class CredentialRepository implements ICredentialRepository {
  constructor(private readonly _database: IDatabase<ICredential>) {}

  save(_credential: ICredential): Promise<ICredential> {
    return this._database.persist(_credential);
  }

  findOne(userName: string): Promise<void | ICredential> {
    return this._database.find(userName);
  }

  remove(_userName: string): Promise<void> {
    return this._database.delete(_userName);
  }
}
