import * as test from 'tape';
import { hash, hmac } from '../../source/main';

test('README - samples usage', (t) => {
	const output = '68607defdaf491bab7dbf54710c5cdfaeef11885a23c484fabc0bc7dda8f600f';
	//  create an object
	const objectA = { greet: 'Hello World', count: Infinity, value: ['a', 'b'] };
	//  create a similar object with a different order of keys
	const objectB = { value: ['a', 'b'], greet: 'Hello World', count: Infinity };

	t.equal(hash(objectA), output, `checksum of ${JSON.stringify(objectA)} is ${output}`);
	t.equal(hash(objectB), output, `checksum of ${JSON.stringify(objectB)} is ${output}`);

	//  prove the objects are different when JSON-encoded
	t.false(JSON.stringify(objectA) === JSON.stringify(objectB), 'the JSON.stringify of both object does not match');

	t.end();
});

test('README - samples hash', (t) => {
	const output = hash('the quick brown fox jumps over the lazy dog');

	t.equal(output, '05c6e08f1d9fdafa03147fcb8f82f124c76d2f70e3d989dc8aadb5e7d7450bec');

	t.end();
});

test('README - samples hash', (t) => {
	const output = hmac('my secret', 'the quick brown fox jumps over the lazy dog');

	t.equal(output, '216262dbc93d393b146b181b966df3525d979499d05f99a00a185edfe425df6e');

	t.end();
});
