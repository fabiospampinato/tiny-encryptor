# Tiny Encryptor

A tiny opinionated isomorphic library for encrypting and decrypting with ease.

## Features

- Data is encrypted using the 256-bit AES-GCM algorithm, using native WebCrypto APIs for performance.
- The initialization vector is automatically properly generated for you.
- The salt is automatically properly generated for you, if you don't provide one.
- Salts of any length are accepted, if they are not 256-bits long they will be hashed with sha256 automatically.
- Only 1 key derivation round with PBKDF2 is performed by default, just to mix the secret with the salt, but this is easily customizable if you want to.
- The encrypted Uint8Array is versioned, so this library can be improved in the future without breaking backwards compatibility.
- The version, initialization vector, salt, and the number of PBKDF2 rounds is prepended as metadata inside the encrypted Uint8Array, so you just need to decide where to store this single encrypted Uint8Array, super convenient and easy to use.

## Install

```sh
npm install --save tiny-encryptor
```

## Usage

```ts
import Encryptor from 'tiny-encryptor';

// Encrypt some data

const data = 'Hello Encryption!'; // The input data to encrypt could be a string, an ArrayBuffer, or a Uint8Array
const secret = 'P@assword!'; // The secret could be a string, a Uint8Array, or already a CryptoKey
const salt = undefined; // The salt could be a string or a Uint8Array, if it's not provided a good one will be generated automatically
const pbkdf2Rounds = 1000; // The number of rounds of PBKDF2 key derivation to perform, it'll be 1 at minimum, to mix the secret and the salt together, but you can set it higher
const encrypted = await Encryptor.encrypt ( data, secret, salt, pbkdf2Rounds ); // => Encrypted Uint8Array

// Decrypt some data

const decrypted = await Encryptor.decrypt ( encrypted, secret ); // => Decrypted Uint8Array
```

## License

MIT © Fabio Spampinato
