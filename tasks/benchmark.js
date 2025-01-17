
/* IMPORT */

import benchmark from 'benchloop';
import Encryptor from '../dist/index.js';

/* HELPERS */

const SECRET = 'P@ssword!';

const SAMPLE_1KB = new Uint8Array ( 1024 );
const SAMPLE_1MB = new Uint8Array ( 1024 * 1024 );
const SAMPLE_1GB = new Uint8Array ( 1024 * 1024 * 1024 );

const ENC_SAMPLE_1KB = await Encryptor.encrypt ( SAMPLE_1KB, SECRET );
const ENC_SAMPLE_1MB = await Encryptor.encrypt ( SAMPLE_1MB, SECRET );
const ENC_SAMPLE_1GB = await Encryptor.encrypt ( SAMPLE_1GB, SECRET );

/* MAIN */

benchmark.group ( 'encrypt', () => {

  benchmark ({
    name: '1KB',
    iterations: 100,
    fn: async () => {
      await Encryptor.encrypt ( SAMPLE_1KB, SECRET );
    }
  });

  benchmark ({
    name: '1MB',
    iterations: 100,
    fn: async () => {
      await Encryptor.encrypt ( SAMPLE_1MB, SECRET );
    }
  });

  benchmark ({
    name: '1GB',
    iterations: 3,
    fn: async () => {
      await Encryptor.encrypt ( SAMPLE_1GB, SECRET );
    }
  });

});

benchmark.group ( 'decrypt', () => {

  benchmark ({
    name: '1KB',
    iterations: 100,
    fn: async () => {
      await Encryptor.decrypt ( ENC_SAMPLE_1KB, SECRET );
    }
  });

  benchmark ({
    name: '1MB',
    iterations: 100,
    fn: async () => {
      await Encryptor.decrypt ( ENC_SAMPLE_1MB, SECRET );
    }
  });

  benchmark ({
    name: '1GB',
    iterations: 3,
    fn: async () => {
      await Encryptor.decrypt ( ENC_SAMPLE_1GB, SECRET );
    }
  });

});

benchmark.summary ();
