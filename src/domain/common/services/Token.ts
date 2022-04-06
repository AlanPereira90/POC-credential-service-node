import jwt from 'jsonwebtoken';

import { TOKEN } from '../../../domain/utils/environment';
import { IToken } from '../interfaces/IToken';

export default class Token implements IToken {
  generate(subject: string, data: Record<string, unknown> = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign({ data }, TOKEN.SECRET, { subject, expiresIn: TOKEN.EXPIRES_IN }, (err, encoded) => {
        if (err) {
          return reject(err); //TODO: RESPONSE ERROR
        }
        resolve(encoded || '');
      });
    });
  }

  verify(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, TOKEN.SECRET, (err) => {
        if (err) {
          return reject(err); //TODO: RESPONSE ERROR
        }
        resolve(true);
      });
    });
  }
}
