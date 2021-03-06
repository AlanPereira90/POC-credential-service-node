export interface ICredentialService {
  signup(userName: string, password: string): Promise<string>;
  signin(userName: string, password: string): Promise<string>;
}
