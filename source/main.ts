import type { Hmac, Hash, BinaryToTextEncoding } from 'crypto';
import { createHash, createHmac, getHashes } from 'crypto';

type Algorithm = string & { __algorithm: never };
type Digest = BinaryToTextEncoding & { __digest: never };
type Updatable = Hash | Hmac;
type Updater = (h: Updatable, value: any) => Updatable;

function guard<T extends string>(name: unknown, valid: () => Array<unknown>): (value: unknown) => T {
	return (value: unknown) => {
		if (valid().includes(value)) {
			return value as T;
		}

		throw new Error(`Unknown ${name}: "${value}"`);
	};
}

const asAlgorithm = guard<Algorithm>('algorithm', getHashes);
const asDigest = guard<Digest>('digest', () => ['hex', 'base64']);
const types: { [key: string]: Updater } = {
	array: (h: Updatable, values: Array<unknown>) => update(h, ...values),
	object: (h: Updatable, value: object) => keys(value)
		.reduce((carry, key) => update(update(carry, key), value[key as keyof typeof value]), h),
	null: (h: Updatable) => update(h, 'NULL'),
	boolean: (h: Updatable, value: boolean) => h.update(value ? 'true' : 'false'),
};

function descriptors(target: object): Array<string> {
	const { constructor: { prototype } } = target;
	const descriptors = Object.getOwnPropertyDescriptors(prototype);

	return Object.keys(descriptors);
}

function keys(target: object): Array<string> {
	return [...new Set(descriptors(target).concat(Object.keys(target)))]
		.filter((key) => key !== '__proto__' && typeof target[key as keyof typeof target] !== 'function')
		.sort((one, two) => -Number(one < two) || Number(one > two));
}


function getTypeUpdater(value: unknown): Updater {
	const type: string = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;

	return type in types ? types[type] : (h: Updatable, value: unknown) => h.update(String(value));
}

function update(h: Updatable, ...args: Array<any>): Updatable {
	return args.reduce((carry, value) => {
		const update = getTypeUpdater(value);

		return update(carry, value);
	}, h);
}

export function hash(value: unknown, algorithm: string = 'sha256', digest: string = 'hex'): string {
	return update(createHash(asAlgorithm(algorithm)), value).digest(asDigest(digest)) as string;
}

export function hmac(secret: string, value: unknown, algorithm: string = 'sha256', digest: string = 'hex'): string {
	return update(createHmac(asAlgorithm(algorithm), secret), value).digest(asDigest(digest)) as string;
}
