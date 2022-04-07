import { INTERNAL_SERVER_ERROR } from 'http-status';
import jwt from 'jsonwebtoken';
import { Lifecycle, registry, scoped } from 'tsyringe';

import { TOKEN } from '../../../domain/utils/environment';
import { IToken, ITokenContent } from '../interfaces/IToken';
import ResponseError from '../../../domain/utils/ResponseError';

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Token', useClass: Token }])
export default class Token implements IToken {
  generate(content: ITokenContent): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { data: content.data },
        TOKEN.SECRET,
        { subject: content.sub, expiresIn: TOKEN.EXPIRES_IN },
        (err, encoded) => {
          if (err) {
            return reject(new ResponseError(INTERNAL_SERVER_ERROR, err.message));
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
          return reject(new ResponseError(INTERNAL_SERVER_ERROR, err.message));
        }
        const { sub, data } = decoded as ITokenContent;
        resolve({ sub, data });
      });
    });
  }
}
