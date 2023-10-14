![tests](https://github.com/konfirm/node-checksum/actions/workflows/tests.yml/badge.svg)
![release](https://github.com/konfirm/node-checksum/actions/workflows/release.yml/badge.svg)

# Checksum

Calculate checksums on any variable type, including objects.

## Installation

Checksum is a scoped package, which means both the installation and `require` (or `import`) need the scope along with the package name:

```
$ npm install --save @konfirm/checksum
```

## Exports

| name   | description                                       |
| ------ | ------------------------------------------------- |
| `hash` | Calculate the Hash (checksum) for the given value |
| `hmac` | Calculate the HMAC (checksum) for the given value |


## Usage

As of version 2.0 the Checksum package has support for TypeScript, JavaScript ES Modules (`import`) and JavaScript CommonJS (`require`).
Prior versions only support CommonJS, as the package was built using it.


### JavaScript (CommonJS)

```js
const { hash } = require('@konfirm/checksum');

//  create an object
const objectA = { greet: 'Hello World', count: Infinity, value: ['a', 'b'] };
//  create a second object, using a different order of the same key/value pairs
const objectB = { value: ['a', 'b'], greet: 'Hello World', count: Infinity };

//  create a hash (using the default algorithm and digest) of both objects
const hashA = hash(objectA);
const hashB = hash(objectB);

console.log({
	hashA, // 68607defdaf491bab7dbf54710c5cdfaeef11885a23c484fabc0bc7dda8f600f
	hashB, // 68607defdaf491bab7dbf54710c5cdfaeef11885a23c484fabc0bc7dda8f600f
	hashes_equal: hashA === hashB, // true
	json_equal: JSON.stringify(objectA) === JSON.stringify(objectB), // false
});
```

#### Using the "default" import
The demonstrated syntax in versions prior to 2.0 used the so-called default import style, e.g.

```js
const Checksum = require('@konfirm/checksum');

//  as in the code above, the `hash` function is now not available directly, but only via `Checksum`
const hashA = Checksum.hash(objectA);
```

This still works, though do consider using the direct import/extraction style, as that is the standard for ES Modules and Typescript.


### JavaScript (ES Modules)
```js
import { hash } from '@konfirm/checksum';

//  create an object
const objectA = { greet: 'Hello World', count: Infinity, value: ['a', 'b'] };
//  create a second object, using a different order of the same key/value pairs
const objectB = { value: ['a', 'b'], greet: 'Hello World', count: Infinity };

//  create a hash (using the default algorithm and digest) of both objects
const hashA = hash(objectA);
const hashB = hash(objectB);

console.log({
	hashA, // 68607defdaf491bab7dbf54710c5cdfaeef11885a23c484fabc0bc7dda8f600f
	hashB, // 68607defdaf491bab7dbf54710c5cdfaeef11885a23c484fabc0bc7dda8f600f
	hashes_equal: hashA === hashB, // true
	json_equal: JSON.stringify(objectA) === JSON.stringify(objectB), // false
});
```

#### Mimicking the "default" import

We are not advocating this style, though it may be beneficial to at least be aware of it. If, for some reason, the "default" is needed, JavaScript allows for this syntax.

```js
import * as Checksum from '@konfirm/checksum';

//  as in the code above, the `hash` function is now not available directly, but only via `Checksum`
const hashA = Checksum.hash(objectA);
```


### TypeScript
```ts
import { hash } from '@konfirm/checksum';

//  create an object
const objectA: object = { greet: 'Hello World', count: Infinity, value: ['a', 'b'] };
//  create a second object, using a different order of the same key/value pairs
const objectB: object = { value: ['a', 'b'], greet: 'Hello World', count: Infinity };

//  create a hash (using the default algorithm and digest) of both objects
const hashA: string = hash(objectA);
const hashB: string = hash(objectB);

console.log({
	hashA, // 68607defdaf491bab7dbf54710c5cdfaeef11885a23c484fabc0bc7dda8f600f
	hashB, // 68607defdaf491bab7dbf54710c5cdfaeef11885a23c484fabc0bc7dda8f600f
	hashes_equal: hashA === hashB, // true
	json_equal: JSON.stringify(objectA) === JSON.stringify(objectB), // false
});
```

#### Mimicking the "default" import

We are not advocating this style, though it may be beneficial to at least be aware of it. If, for some reason, the "default" is needed, TypeScript allows for this syntax.

```ts
import * as Checksum from '@konfirm/checksum';

//  as in the code above, the `hash` function is now not available directly, but only via `Checksum`
const hashA: string = Checksum.hash(objectA);
```


## API

### `hash(value: any, algorithm: string = 'sha256', digest: string = 'hex'): string`
Calculates the checksum using a Hash object with the optional algorithm (default `'sha256'`) and returns the created hash as a string using the optional digest method (default `'hex'`)

#### TypeScript

```ts
import { hash } from '@konfirm/checksum';
const output: string = hash('the quick brown fox jumps over the lazy dog');

console.log(output); // 05c6e08f1d9fdafa03147fcb8f82f124c76d2f70e3d989dc8aadb5e7d7450bec
```

#### JavaScript (ES Modules)

```js
import { hash } from '@konfirm/checksum';
const output = hash('the quick brown fox jumps over the lazy dog');

console.log(output); // 05c6e08f1d9fdafa03147fcb8f82f124c76d2f70e3d989dc8aadb5e7d7450bec
```


#### JavaScript (CommonJS)

```js
const { hash } = require('@konfirm/checksum');
const output = hash('the quick brown fox jumps over the lazy dog');

console.log(output); // 05c6e08f1d9fdafa03147fcb8f82f124c76d2f70e3d989dc8aadb5e7d7450bec
```


### `hmac(secret: string, value: any, algorithm: string = 'sha256', digest: string = 'hex'): string`
Calculates the checksum using an HMAC object using the provided secret with the optional algorithm (default `'sha256'`) and returns the created hash as a string using the optional digest method (default `'hex'`). Although the use is different, it can be used as a salted checksum.


#### TypeScript

```ts
import { hmac } from '@konfirm/checksum';
const output: string = hmac('my secret', 'the quick brown fox jumps over the lazy dog');

console.log(output); // 216262dbc93d393b146b181b966df3525d979499d05f99a00a185edfe425df6e
```

#### JavaScript (ES Modules)

```js
import { hmac } from '@konfirm/checksum';
const output = hmac('my secret', 'the quick brown fox jumps over the lazy dog');

console.log(output); // 216262dbc93d393b146b181b966df3525d979499d05f99a00a185edfe425df6e
```


#### JavaScript (CommonJS)

```js
const { hmac } = require('@konfirm/checksum');
const output = hmac('my secret', 'the quick brown fox jumps over the lazy dog');

console.log(output); // 216262dbc93d393b146b181b966df3525d979499d05f99a00a185edfe425df6e
```


## Migrating from version 1.0 to 2.0

### Removed features

Several previously public available members have been removed from the package

 - `verifyAlgorithmAndDigest` method, this has been removed as its internal mechanics have been improved to safeguard the values given
 - `ALGORITHMS` property, this has always been the `crypto.getHashes()` output; if the list is needed, please update to use the `getHashes` method instead.
 - `DIGEST_METHODS`, this used to provide an array with the values `'hex'`', `'base64'` and `'latin1'`

The digest method `'latin1'` has been removed from the supported options, leaving only `'hex'` and `'base64'`

As the Checksum package did not have TypeScript or ES Module support before, users of those may be able to remove any workaround needed (not aware of any), and TypeScript users now have better type hinting (even though the package is mainly strings on the outside).

For the CommonJS users importing the entire library (`const Checksum = require('@konfirm/checksum');`), that syntax still works, though we (now) recommend picking only what is needed.

```js
const { hmac } = require('@konfirm/checksum');
```


## License

MIT License Copyright (c) 2017-2021 Rogier Spieker (Konfirm)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
