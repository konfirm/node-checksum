const crypto = require('crypto');
const Updater = require('./updater');

/**
 *  Checksum
 *
 *  @class  Checksum
 */
class Checksum {
	/**
	 *  Calculate the checksum for the given value using a Hash object with
	 *  the provided algorithm and digest method
	 *
	 *  @static
	 *  @param     {any}     value
	 *  @param     {string}  [algorithm='sha256']
	 *  @param     {string}  [digest='hex']
	 *  @return    {string}  checksum
	 *  @memberof  Checksum
	 */
	static hash(value, algorithm = 'sha256', digest = 'hex') {
		this.verifyAlgorithmAndDigest(algorithm, digest);

		return Updater.update(crypto.createHash(algorithm), value)
			.digest(digest);
	}

	/**
	 *  Calculate the checksum for the given value using an HMAC object with
	 *  the provided algorithm and digest method
	 *
	 *  @static
	 *  @param     {string}  secret
	 *  @param     {any}     value
	 *  @param     {string}  [algorithm='sha256']
	 *  @param     {string}  [digest='hex']
	 *  @return    {string}  checksum
	 *  @memberof  Checksum
	 */
	static hmac(secret, value, algorithm = 'sha256', digest = 'hex') {
		this.verifyAlgorithmAndDigest(algorithm, digest);

		return Updater.update(crypto.createHmac(algorithm, secret), value)
			.digest(digest);
	}

	/**
	 *  Verify whether both the algorithm and digest method exist
	 *
	 *  @static
	 *  @param     {string}   algorithm
	 *  @param     {string}   digest
	 *  @returns   {boolean}  verifies
	 *  @throws    {Error}    Unknown algorithm: <algorithm>
	 *  @throws    {Error}    Unknown digest method: <digest>
	 *  @memberof  Checksum
	 */
	static verifyAlgorithmAndDigest(algorithm, digest) {
		if (this.ALGORITHMS.indexOf(algorithm) < 0) {
			throw new Error(`Unknown algorithm: ${ algorithm }`);
		}

		if (this.DIGEST_METHODS.indexOf(digest) < 0) {
			throw new Error(`Unknown digest method: ${ digest }`);
		}

		return true;
	}

	/**
	 *  Obtain all available algorithms (from crypto.getHashes)
	 *
	 *  @readonly
	 *  @static
	 *  @return    {string[]}  algorithm
	 *  @memberof  Checksum
	 */
	static get ALGORITHMS() {
		return crypto.getHashes();
	}

	/**
	 *  Obtain all available digest methods
	 *
	 *  @readonly
	 *  @static
	 *  @return    {string[]}  digest methods
	 *  @memberof  Checksum
	 */
	static get DIGEST_METHODS() {
		return [ 'hex', 'latin1', 'base64' ];
	}
}

module.exports = Checksum;
