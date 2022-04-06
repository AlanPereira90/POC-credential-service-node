export interface ICredential {
  id: string;
  userName: string;
  password: string;
  extraData?: Record<string, unknown>;
}
