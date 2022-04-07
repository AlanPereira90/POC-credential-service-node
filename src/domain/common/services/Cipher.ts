import { AES, enc } from 'crypto-js';
import { Lifecycle, registry, scoped } from 'tsyringe';

import { CIPHER } from '../../utils/environment';
import { ICipher } from '../interfaces/ICipher';

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Cipher', useClass: Cipher }])
export default class Cipher implements ICipher {
  encrypt(data: string): string {
    return AES.encrypt(data, CIPHER.KEY).toString();
  }

  decrypt(data: string): string {
    return AES.decrypt(data, CIPHER.KEY).toString(enc.Utf8);
  }
}
