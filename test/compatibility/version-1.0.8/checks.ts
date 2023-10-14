import { getHashes } from 'node:crypto';
import * as test from 'tape';
import * as main from '../../../source/main';
import { hash as hashdata } from './hash';
import { hmac as hmacdata } from './hmac';

const engineSupportedHashes = getHashes();

test('Checksum/hash - v1.0.8 compatibility', (t) => {
	hashdata
		.reduce((carry, { algorithm }) => carry.concat(algorithm), [] as Array<string>)
		.filter((v, i, a) => a.indexOf(v) === i)
		.forEach((algorithm) => {
			const data = hashdata.filter((record) => record.algorithm.includes(algorithm));
			const every = (key: 'hex' | 'base64', digest?: 'hex' | 'base64') =>
				data.every(({ input, [key]: checksum }) => main.hash(input, algorithm, digest) === checksum);

			if (engineSupportedHashes.includes(algorithm)) {
				t.true(every('hex'), `algorithm "${algorithm}", digest undefined`);
				t.true(every('hex', 'hex'), `algorithm "${algorithm}", digest 'hex'`);
				t.true(every('base64', 'base64'), `algorithm "${algorithm}", digest 'base64'`,);
			}
			else {
				t.throws(
					() => main.hash('deprecated', algorithm, 'hex'), new RegExp(`Unknown algorithm: "${algorithm}"`), `algorithm "${algorithm}" not supported by Node.js ${process.version}`,);
			}
		});

	t.end();
});

test('Checksum/hmac - v1.0.8 compatibility', (t) => {
	const secret = 'super secret';

	hmacdata
		.reduce((carry, { algorithm }) => carry.concat(algorithm), [] as Array<string>)
		.filter((v, i, a) => a.indexOf(v) === i)
		.forEach((algorithm) => {
			const data = hmacdata.filter((record) => record.algorithm.includes(algorithm));
			const every = (key: 'hex' | 'base64', digest?: 'hex' | 'base64') =>
				data.every(({ input, [key]: checksum }) => main.hmac(secret, input, algorithm, digest) === checksum);

			if (engineSupportedHashes.includes(algorithm)) {
				t.true(every('hex'), `algorithm "${algorithm}", digest undefined`);
				t.true(every('hex', 'hex'), `algorithm "${algorithm}", digest 'hex'`);
				t.true(every('base64', 'base64'), `algorithm "${algorithm}", digest 'base64'`,);
			}
			else {
				t.throws(() => main.hash('deprecated', algorithm, 'hex'), new RegExp(`Unknown algorithm: "${algorithm}"`), `algorithm "${algorithm}" not supported by Node.js ${process.version}`);
			}
		});

	t.end();
});
