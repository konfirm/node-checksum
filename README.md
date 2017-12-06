# Checksum

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a54c0610b8c04df2924a332c2f95c6de)](https://www.codacy.com/app/konfirm/node-checksum?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=konfirm/node-checksum&amp;utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.org/konfirm/node-checksum.svg?branch=master)](https://travis-ci.org/konfirm/node-checksum)

Calculate checksums on any variable type, including objects.

## Installation
Checksum is a scoped package, which means both the installation and `require` (or `import`) need the scope along with the package name:

```
$ npm install --save @konfirm/checksum
```


## Usage

```
//  require the Checksum library
const Checksum = require('@konfirm/checksum');

//  create an object
const objectA = { greet: 'Hello World', count: Infinity, value: [ 'a', 'b' ] };
//  create a similar object with a different order of keys
const objectB = { value: [ 'a', 'b' ],  greet: 'Hello World', count: Infinity };

//  create the checksums (using the default algorithm and digest)
const checksumA = Checksum.create(objectA);
const checksumB = Checksum.create(objectB);

console.log(checksumA);
//  > '68607defdaf491bab7dbf54710c5cdfaeef11885a23c484fabc0bc7dda8f600f'

//  prove the checksums are equal
console.log(checksumA === checksumB);
//  > true

//  prove the objects are different when JSON-encoded
console.log(JSON.stringify(objectA) === JSON.stringify(objectB));
//  > false
```


## API
Checksum is fully static, it provides two methods for creating a checksum.

### hash
Calculates the checksum using a Hash object with the optional algorith (default `'sha256'`) and return the created hash as a string using the optional digest method (default `'hex'`)

Syntax: `<string> Checksum.create(<any value> [, <string algorithm='sha256'> [, <string digest='hex'>]])`

Example:
```
const Checksum = require('@konfirm/checksum');
const output = Checksum.hash('my secret', 'the quick brown fox jumps over the lazy dog');

console.log(output);
//  > '05c6e08f1d9fdafa03147fcb8f82f124c76d2f70e3d989dc8aadb5e7d7450bec'
```


### hmac
Calculates the checksum using an HMAC object using the provided secret with the optional algorith (default `'sha256'`) and return the created hash as a string using the optional digest method (default `'hex'`). Albeit the use is different, it can be used as a salted checksum.

Syntax: `<string> Checksum.hmac(<string secret>, <any value> [, <string algorithm='sha256'> [, <string digest='hex'>]])`

Example:
```
const Checksum = require('@konfirm/checksum');
const output = Checksum.hmac('my secret', 'the quick brown fox jumps over the lazy dog');

console.log(output);
//  > '216262dbc93d393b146b181b966df3525d979499d05f99a00a185edfe425df6e'
```

### constants
There are two constants available to obtain all available algorithms and digest methods.

 constant         | type  | provides
------------------|-------|---------
 `ALGORITMS`      | array | All available algorithms (same as `require('crypto').getHashes()`)
 `DIGEST_METHODS` | array | All available digest methods (`hex`, `latin1`, `base64`)

## License

MIT License Copyright (c) 2017 Rogier Spieker (Konfirm)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
