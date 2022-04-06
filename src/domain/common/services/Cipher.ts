import { AES, enc } from 'crypto-js';

import { CIPHER } from '../../utils/environment';
import { ICipher } from '../interfaces/ICipher';

export default class Cipher implements ICipher {
  encrypt(data: string): string {
    return AES.encrypt(data, CIPHER.KEY).toString();
  }

  decrypt(data: string): string {
    return AES.decrypt(data, CIPHER.KEY).toString(enc.Utf8);
  }
}
