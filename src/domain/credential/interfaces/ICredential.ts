export interface ICredential {
  userName: string;
  password: string;
  extraData?: Record<string, unknown>;
}
