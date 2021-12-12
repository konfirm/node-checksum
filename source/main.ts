import type { Hmac, Hash, BinaryToTextEncoding } from 'crypto';
import { createHash, createHmac, getHashes } from 'crypto';

type Algorithm = string & { __algorithm: never };
type Digest = BinaryToTextEncoding & { __digest: never };
type Updatable = Hash | Hmac;
type Updater = (h: Updatable, value: any) => Updatable;
type TypeUpdate = { [key: string]: Updater };

/**
 * Create a type check based on a list of valid values
 *
 * @template T
 * @param {unknown} name
 * @param {() => Array<unknown>} valid
 * @returns {(value: unknown) => T}
 */
function check<T extends string>(name: unknown, ...values: Array<unknown>): (value: unknown) => T {
	return (value: unknown) => {
		if (values.includes(value)) {
			return value as T;
		}

		throw new Error(`Unknown ${name}: "${value}"`);
	};
}

// Algorithm type check
const asAlgorithm = check<Algorithm>('algorithm', ...getHashes());
// Digest type check
const asDigest = check<Digest>('digest', 'hex', 'base64');
// Type specific Hash/Hmac updaters
const types: TypeUpdate = {
	array: (h: Updatable, values: Array<unknown>) => update(h, ...values),
	object: (h: Updatable, value: object) => keys(value)
		.reduce((carry, key) => update(update(carry, key), value[key as keyof typeof value]), h),
	null: (h: Updatable) => update(h, 'NULL'),
	boolean: (h: Updatable, value: boolean) => h.update(value ? 'true' : 'false'),
};

/**
 * Get all object keys from its descriptors
 *
 * @param {object} target
 * @returns {Array<string>}
 */
function descriptors(target: object): Array<string> {
	const { constructor: { prototype } } = target;
	const descriptors = Object.getOwnPropertyDescriptors(prototype);

	return Object.keys(descriptors);
}

/**
 * Find all possible keys on an object which may contain state
 *
 * @param {object} target
 * @returns {Array<string>}
 */
function keys(target: object): Array<string> {
	return [...new Set(descriptors(target).concat(Object.keys(target)))]
		.filter((key) => key !== '__proto__' && typeof target[key as keyof typeof target] !== 'function')
		.sort((one, two) => -Number(one < two) || Number(one > two));
}

/**
 * Obtain the updater for the type of value
 *
 * @param {unknown} value
 * @returns {Updater}
 */
function getTypeUpdater(value: unknown): Updater {
	const type: string = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

	return type in types ? types[type] : (h: Updatable, value: unknown) => h.update(String(value));
}

/**
 * Update the Hmac/Hash using the method appropriate for the types given
 *
 * @param {Updatable} h
 * @param {...Array<any>} args
 * @returns {Updatable}
 */
function update(h: Updatable, ...args: Array<any>): Updatable {
	return args.reduce((carry, value) => {
		const update = getTypeUpdater(value);

		return update(carry, value);
	}, h);
}

/**
 * Calculate the Hash checksum for the given value using the provided algorithm
 * and digest method
 *
 * @export
 * @param {unknown} value
 * @param {string} [algorithm='sha256']
 * @param {string} [digest='hex']
 * @returns {string}
 */
export function hash(value: unknown, algorithm: string = 'sha256', digest: string = 'hex'): string {
	return update(createHash(asAlgorithm(algorithm)), value).digest(asDigest(digest)) as string;
}

/**
 * Calculate the HMAC checksum for the given value using the provided algorithm
 * and digest method
 *
 * @export
 * @param {string} secret
 * @param {unknown} value
 * @param {string} [algorithm='sha256']
 * @param {string} [digest='hex']
 * @returns {string}
 */
export function hmac(secret: string, value: unknown, algorithm: string = 'sha256', digest: string = 'hex'): string {
	return update(createHmac(asAlgorithm(algorithm), secret), value).digest(asDigest(digest)) as string;
}
