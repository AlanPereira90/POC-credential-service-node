import { ICredential } from './ICredential';

export interface ICredentialRepository {
  save(credential: ICredential): Promise<ICredential>;
  findOne(userName: string): Promise<ICredential | void>;
  remove(userName: string): Promise<void>;
}
