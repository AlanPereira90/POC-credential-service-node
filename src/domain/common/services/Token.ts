import jwt from 'jsonwebtoken';

import { TOKEN } from '../../../domain/utils/environment';
import { IToken, ITokenContent } from '../interfaces/IToken';

export default class Token implements IToken {
  generate(content: ITokenContent): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { data: content.data },
        TOKEN.SECRET,
        { subject: content.sub, expiresIn: TOKEN.EXPIRES_IN },
        (err, encoded) => {
          if (err) {
            return reject(err); //TODO: RESPONSE ERROR
          }
          resolve(encoded || '');
        },
      );
    });
  }

  verify(token: string): Promise<ITokenContent> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, TOKEN.SECRET, (err, decoded) => {
        if (err) {
          return reject(err); //TODO: RESPONSE ERROR
        }
        const { sub, data } = decoded as ITokenContent;
        resolve({ sub, data });
      });
    });
  }
}
