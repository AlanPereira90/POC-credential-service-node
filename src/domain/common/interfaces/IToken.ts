export interface IToken {
  generate(subject: string, data?: Record<string, unknown>): Promise<string>;
  verify(token: string): Promise<boolean>;
}
