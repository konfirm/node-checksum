import * as test from 'tape';
import * as main from '../../source/main';
import { getHashes } from 'crypto';

const algorithms = getHashes();
const digests = [undefined, 'hex', 'base64'];

test('Checksum - exports', (t) => {
	const expected = ['hash', 'hmac'];
	const keys = Object.keys(main);

	t.equal(keys.length, expected.length, `exports ${expected.length} keys`);
	expected.forEach((key) => {
		t.true(typeof main[key as keyof typeof main] === 'function', `exports function ${key}`)
	});

	t.end();
});

test('Checksum/hash - algorithms', (t) => {
	t.true(algorithms.every((algorithm) => main.hash('a simple string', algorithm).length > 0), `all ${algorithms.length} algorithms generate a hash`);
	t.throws(() => main.hash('a simple string', 'wouldBeInterestingIfThisDoesNotFail'), /Unknown algorithm: "wouldBeInterestingIfThisDoesNotFail"/, 'throws on unknown algorithm');

	t.equal(
		main.hash('a simple string', 'sha256'),
		main.hash('a simple string'),
		'sha256 is the default algorithm'
	);

	t.end();
});

test('Checksum/hash - digests', (t) => {
	t.true(digests.every((digest) => main.hash('a simple string', 'sha256', digest).length > 0), `all ${digests.length} digests generate a hash`);
	t.throws(() => main.hash('a simple string', 'sha256', 'wouldBeInterestingIfThisDoesNotFail').length > 0, /Unknown digest: "wouldBeInterestingIfThisDoesNotFail"/, 'throws on unknown digest');

	t.equal(
		main.hash('a simple string', 'sha256', 'hex'),
		main.hash('a simple string', 'sha256'),
		'"hex"" is the default digest'
	);

	t.end();
});

test('Checksum/hash - consistency', (t) => {
	// objects with the same key/values, in different order
	const one = { bool: true, num: Infinity, arr: [7, 33, 77], obj: { foo: 'a', bar: null } };
	const two = { arr: [7, 33, 77], bool: true, obj: { bar: null, foo: 'a' }, num: Infinity };

	t.doesNotEqual(JSON.stringify(one), JSON.stringify(two), 'JSON.stringify is not equal');
	t.true(algorithms.every((algorithm) => main.hash(one, algorithm) === main.hash(two, algorithm)), `all ${algorithms.length} algorithms generate the same hash for objects with the same key/value pairs`);

	t.end();
});

test('Checksum/hmac - algorithms', (t) => {
	const pattern = /^shake(?:128|256)$/;
	const shake = algorithms.filter((alg) => pattern.test(alg));
	const noShake = algorithms.filter((alg) => !pattern.test(alg));

	t.true(noShake.every((algorithm) => main.hmac('super secret', 'a simple string', algorithm).length > 0), `all ${noShake.length} non-shake128/256 algorithms generate a hmac`);
	t.throws(() => main.hmac('super secret', 'a simple string', 'wouldBeInterestingIfThisDoesNotFail'), /Unknown algorithm: "wouldBeInterestingIfThisDoesNotFail"/, 'throws on unknown algorithm');

	// some weird SSL error for hmac and shake128, shake256
	// not testable using t.throws
	shake.forEach((algorithm) => {
		try {
			t.false(main.hmac('super secret', 'a simple string', algorithm).length > 0, `${algorithm} works`);
		}
		catch (error) {
			t.match(String(error), /error:00000000:lib\(0\):(?:func\(0\))?:reason\(0\)/, `algorithm ${algorithm} throws ${error}`)
		}
	});

	t.equal(
		main.hmac('super secret', 'a simple string', 'sha256'),
		main.hmac('super secret', 'a simple string'),
		'sha256 is the default algorithm'
	)

	t.end();
});

test('Checksum/hmac - digests', (t) => {
	t.true(digests.every((digest) => main.hmac('super secret', 'a simple string', 'sha256', digest).length > 0), `all ${digests.length} digests generate a hmac`);
	t.throws(() => main.hmac('super secret', 'a simple string', 'sha256', 'wouldBeInterestingIfThisDoesNotFail').length > 0, /Unknown digest: "wouldBeInterestingIfThisDoesNotFail"/, 'throws on unknown digest');

	t.equal(
		main.hmac('super secret', 'a simple string', 'sha256', 'hex'),
		main.hmac('super secret', 'a simple string', 'sha256'),
		'"hex"" is the default digest'
	);

	t.end();
});

test('Checksum/hmac - consistency', (t) => {
	const pattern = /^shake(?:128|256)$/;
	const noShake = algorithms.filter((alg) => !pattern.test(alg));

	// objects with the same key/values, in different order
	const one = { bool: true, num: Infinity, arr: [7, 33, 77], obj: { foo: 'a', bar: null } };
	const two = { arr: [7, 33, 77], bool: true, obj: { bar: null, foo: 'a' }, num: Infinity };

	t.doesNotEqual(JSON.stringify(one), JSON.stringify(two), 'JSON.stringify is not equal');
	t.true(noShake.every((algorithm) => main.hmac('super secret', one, algorithm) === main.hmac('super secret', two, algorithm)), `all ${noShake.length} non-shake129/256 algorithms generate the same hmac for objects with the same key/value pairs`);

	t.end();
});
