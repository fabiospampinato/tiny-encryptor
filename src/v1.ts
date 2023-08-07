
/* IMPORT */

import pbkdf2 from 'crypto-pbkdf2-hmac';
import getRandomBytes from 'crypto-random-uint8';
import {sha256} from 'crypto-sha';
import Int32 from 'int32-encoding';
import webcrypto from 'tiny-webcrypto';
import concat from 'uint8-concat';
import U8 from 'uint8-encoding';

/* MAIN */

const encrypt = async ( input: ArrayBuffer | Uint8Array | string, secret: CryptoKey | Uint8Array | string, salt?: Uint8Array | string, pbkdf2Rounds?: number ): Promise<Uint8Array> => {

  input = ( typeof input === 'string' ) ? U8.encode ( input ) : input;
  salt = ( typeof salt === 'string' ) ? U8.encode ( salt ) : salt || getRandomBytes ( 32 );
  salt = ( salt.length === 32 ) ? salt : await sha256.uint8 ( salt );

  const version = new Uint8Array ([ 1 ]);

  const rounds = Math.max ( 1, pbkdf2Rounds || 0 );

  const keyRaw = await pbkdf2.sha256.uint8 ( secret, salt, rounds, 32 );
  const key = await webcrypto.subtle.importKey ( 'raw', keyRaw, 'AES-GCM', false, ['encrypt'] );

  const iv = getRandomBytes ( 16 );

  const encryptedBuffer = await webcrypto.subtle.encrypt ( { name: 'AES-GCM', iv, length: 256, tagLength: 128 }, key, input );
  const encryptedUint8 = new Uint8Array ( encryptedBuffer );

  const archive = concat ([ version, salt, Int32.encode ( rounds ), iv, encryptedUint8 ]); //TODO: This could be significantly optimized if somehow we didn't have to copy the uint8... 🙏

  return archive;

};

const decrypt = async ( input: Uint8Array, secret: CryptoKey | Uint8Array | string ): Promise<Uint8Array> => {

  const version = input[0];

  if ( version !== 1 ) throw new Error ( 'Unsupported encrypted archive version' );

  const salt = input.slice ( 1, 33 );
  const rounds = Int32.decode ( input.slice ( 33, 37 ) );
  const iv = input.slice ( 37, 53 );
  const encrypted = input.slice ( 53 );

  const keyRaw = await pbkdf2.sha256.uint8 ( secret, salt, rounds, 32 );
  const key = await webcrypto.subtle.importKey ( 'raw', keyRaw, 'AES-GCM', false, ['decrypt'] );

  const decryptedBuffer = await webcrypto.subtle.decrypt ( { name: 'AES-GCM', iv, length: 256, tagLength: 128 }, key, encrypted );
  const decryptedUint8 = new Uint8Array ( decryptedBuffer );

  return decryptedUint8;

};

/* EXPORT */

export {encrypt, decrypt};
