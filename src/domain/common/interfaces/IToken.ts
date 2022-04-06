export interface IToken {
  generate(subject: string, data?: Record<string, unknown>): Promise<string>;
  //verify(token: string): Promise<boolean>;
  //introspect(token: string): Record<string, unknown>;
}
