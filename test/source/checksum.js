/* global source, describe, it, expect */
/* eslint max-nested-callbacks: ["error", 7]*/
const crypto = require('crypto');
const Checksum = source('checksum');

function nameIt(value) {
	if (value === Math.PI) {
		return 'Math.PI';
	}
	if (value === Infinity) {
		return 'Infinity';
	}
	if (value === null) {
		return 'NULL';
	}
	if (isNaN(value)) {
		return 'NaN';
	}

	return JSON.stringify(value);
}

describe('Checksum', () => {
	describe('Constants', () => {
		it('provides all available algorithms as an array of strings', (next) => {
			const algorithms = Checksum.ALGORITHMS;
			const types = algorithms
				.map((value) => typeof value)
				.filter((value, index, all) => all.indexOf(value) === index);

			expect(algorithms).to.be.array();
			expect(algorithms.length).to.be.above(0);
			expect(types).to.equal([ 'string' ]);

			next();
		});

		it('provides all available digest methods as an array of strings', (next) => {
			const digest = Checksum.DIGEST_METHODS;
			const types = digest
				.map((value) => typeof value)
				.filter((value, index, all) => all.indexOf(value) === index);

			expect(digest).to.be.array();
			expect(digest.length).to.be.above(0);
			expect(types).to.equal([ 'string' ]);

			next();
		});
	});

	describe('Methods', () => {
		const algorithms = Checksum.ALGORITHMS;
		const digest = Checksum.DIGEST_METHODS;
		const secret = 'The secret to use for HMAC';
		const tests = [
			{ value: 'aaa' },
			{ value: 1234 },
			{ value: true },
			{ value: false },
			{ value: Infinity },
			{ value: Math.PI },
			{ value: undefined },
			{ value: null },
			{ value: NaN },
			{ value: [
				'aaa',
				1234,
				true,
				false,
				Infinity,
				Math.PI,
				undefined,
				null,
				NaN,
			] },
			{ value: { a: 1, b: 2 } },
			{ value: { a: 1, b: 2, c: [ 1, 'a', true ] }, against: { b: 2, c: [ 1, 'a', true ], a: 1 } },

		];

		tests.forEach((compare) => {
			const message = [ `Value ${ nameIt(compare.value) }` ];

			if ('against' in compare) {
				message.push('against', nameIt(compare.against));
			}
			else {
				compare.against = compare.value;
			}

			describe('throws on invalid algorithm', () => {
				it('create', (next) => {
					expect(() => Checksum.create(compare.value, 'foo'))
						.to.throw(Error, 'Unknown algorithm: foo');

					next();
				});

				it('hmac', (next) => {
					expect(() => Checksum.hmac(secret, compare.value, 'foo'))
						.to.throw(Error, 'Unknown algorithm: foo');

					next();
				});
			});

			describe(message.join(' '), () => {
				algorithms.forEach((algorithm) => {
					digest.forEach((dgst) => {
						it(`create using algorithm "${ algorithm }", digest "${ dgst }"`, (next) => {
							const one = Checksum.create(compare.value, algorithm, dgst);
							const two = Checksum.create(compare.against, algorithm, dgst);

							expect(one).to.equal(two);

							next();
						});

						it(`hmac using algorithm "${ algorithm }", digest "${ dgst }"`, (next) => {
							const one = Checksum.hmac(secret, compare.value, algorithm, dgst);
							const two = Checksum.hmac(secret, compare.against, algorithm, dgst);
							const not = Checksum.hmac(`${ secret }.`, compare.value, algorithm, dgst);

							expect(one).to.equal(two);

							expect(not.length).to.equal(one.length);
							expect(not.length).to.equal(two.length);

							expect(not).not.to.equal(one);
							expect(not).not.to.equal(two);

							next();
						});
					});

					it(`create using algorithm "${ algorithm }", digest "foo"`, (next) => {
						expect(() => Checksum.create(compare.value, algorithm, 'foo'))
							.to.throw(Error, 'Unknown digest method: foo');

						next();
					});

					it(`hmac using algorithm "${ algorithm }", digest "foo"`, (next) => {
						expect(() => Checksum.hmac(secret, compare.value, algorithm, 'foo'))
							.to.throw(Error, 'Unknown digest method: foo');

						next();
					});
				});
			});
		});
	});
});
