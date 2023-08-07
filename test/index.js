
/* IMPORT */

import {describe} from 'fava';
import U8 from 'uint8-encoding';
import Encryptor from '../dist/index.js';

/* MAIN */

describe ( 'Tiny Encryptor', it => {

  it ( 'can encrypt and decrypt a string', async t => {

    const input = 'Hello World!';
    const encrypted = await Encryptor.encrypt ( input, 'P@ssword!' );

    t.is ( encrypted instanceof Uint8Array, true );

    const decrypted = await Encryptor.decrypt ( encrypted, 'P@ssword!' );

    t.is ( decrypted instanceof Uint8Array, true );

    const decoded = U8.decode ( decrypted );

    t.is ( decoded, input );

  });

  it ( 'can encrypt and decrypt a Uint8Array', async t => {

    const input = U8.encode ( 'Hello World!' );
    const encrypted = await Encryptor.encrypt ( input, 'P@ssword!' );

    t.is ( encrypted instanceof Uint8Array, true );

    const decrypted = await Encryptor.decrypt ( encrypted, 'P@ssword!' );

    t.is ( decrypted instanceof Uint8Array, true );
    t.deepEqual ( decrypted, input );

  });

  it ( 'can encrypt and decrypt an ArrayBuffer', async t => {

    const input = U8.encode ( 'Hello World!' ).buffer;
    const encrypted = await Encryptor.encrypt ( input, 'P@ssword!' );

    t.is ( encrypted instanceof Uint8Array, true );

    const decrypted = await Encryptor.decrypt ( encrypted, 'P@ssword!' );

    t.is ( decrypted instanceof Uint8Array, true );
    t.deepEqual ( decrypted.buffer, input );

  });

  it ( 'can use a salt of any length', async t => {

    for ( const salt of ['', 'a', 'a'.repeat ( 10 ), 'a'.repeat ( 500 )] ) {

      const input = 'Hello World!';
      const encrypted = await Encryptor.encrypt ( input, 'P@ssword!', salt );

      t.is ( encrypted instanceof Uint8Array, true );

      const decrypted = await Encryptor.decrypt ( encrypted, 'P@ssword!' );

      t.is ( decrypted instanceof Uint8Array, true );

      const decoded = U8.decode ( decrypted );

      t.is ( decoded, input );

    }

  });

  it ( 'can use any number of PBKDF2 rounds', async t => {

    for ( const rounds of [0, 1, 10, 500] ) {

      const input = 'Hello World!';
      const encrypted = await Encryptor.encrypt ( input, 'P@ssword!', undefined, rounds );

      t.is ( encrypted instanceof Uint8Array, true );

      const decrypted = await Encryptor.decrypt ( encrypted, 'P@ssword!' );

      t.is ( decrypted instanceof Uint8Array, true );

      const decoded = U8.decode ( decrypted );

      t.is ( decoded, input );

    }

  });

});
