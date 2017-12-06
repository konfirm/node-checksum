/* global source, describe, it, expect */

const Checksum = source('checksum');

describe('README.js', () => {
	it('samples usage', (next) => {
		//  require the Checksum library
		// const Checksum = require('@konfirm/checksum');

		//  create an object
		const objectA = { greet: 'Hello World', count: Infinity, value: [ 'a', 'b' ] };
		//  create a similar object with a different order of keys
		const objectB = { value: [ 'a', 'b' ],  greet: 'Hello World', count: Infinity };

		//  create the checksums (using the default algorithm and digest)
		const checksumA = Checksum.hash(objectA);
		const checksumB = Checksum.hash(objectB);

		expect(checksumA).to.equal('68607defdaf491bab7dbf54710c5cdfaeef11885a23c484fabc0bc7dda8f600f');

		//  prove the checksums are equal
		expect(checksumA).to.equal(checksumB);

		//  prove the objects are different when JSON-encoded
		expect(JSON.stringify(objectA)).not.to.equal(JSON.stringify(objectB));

		next();
	});

	it('samples hash', (next) => {
		// const Checksum = require('@konfirm/checksum');
		const output = Checksum.hash('the quick brown fox jumps over the lazy dog');

		expect(output).to.equal('05c6e08f1d9fdafa03147fcb8f82f124c76d2f70e3d989dc8aadb5e7d7450bec');

		next();
	});

	it('samples hmac', (next) => {
		// const Checksum = require('@konfirm/checksum');
		const output = Checksum.hmac('my secret', 'the quick brown fox jumps over the lazy dog');

		expect(output).to.equal('216262dbc93d393b146b181b966df3525d979499d05f99a00a185edfe425df6e');

		next();
	});
});
