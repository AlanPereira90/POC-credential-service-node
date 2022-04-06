export interface ITokenContent {
  sub: string;
  data: {
    id: string;
    [key: string]: unknown;
  };
}

export interface IToken {
  generate(content: ITokenContent): Promise<string>;
  verify(token: string): Promise<ITokenContent>;
}
