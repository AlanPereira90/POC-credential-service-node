import { AES } from 'crypto-js';

import { CIPHER } from '../../utils/environment';
import { ICipher } from '../interfaces/ICipher';

export default class Cipher implements ICipher {
  encrypt(data: string): string {
    return AES.encrypt(data, CIPHER.KEY).toString();
  }
}
