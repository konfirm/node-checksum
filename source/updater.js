/**
 *  Update hash with various types of values
 *
 *  @package  @konfirm/checksum
 *  @class Updater
 */
class Updater {
	/**
	 *  Update the hash using the method appropriate for the type
	 *
	 *  @static
	 *  @param     {Hash|Hmac}  hash
	 *  @param     {any}        value
	 *  @return    {Hash|Hmac}  hash
	 *  @memberof  Updater
	 */
	static update(hash, value) {
		const type = Array.isArray(value) ? 'array' : typeof value;

		return this[type](hash, value);
	}

	/**
	 *  Update the hash using numeric input
	 *
	 *  @static
	 *  @param     {Hash|Hmac}  hash
	 *  @param     {Number}     value
	 *  @return    {Hash|Hmac}  hash
	 *  @memberof  Updater
	 */
	static number(hash, value) {
		return hash.update(String(value));
	}

	/**
	 *  Update the hash using string input
	 *
	 *  @static
	 *  @param     {Hash|Hmac}  hash
	 *  @param     {String}     value
	 *  @return    {Hash|Hmac}  hash
	 *  @memberof  Updater
	 */
	static string(hash, value) {
		return hash.update(value);
	}

	/**
	 *  Update the hash using an object as input, as the ordering of keys does
	 *  not matter to javascript but does for a checksum, the keys are sorted
	 *  before the hash is updated
	 *
	 *  @static
	 *  @param     {Hash|Hmac}  hash
	 *  @param     {Object}     value
	 *  @return    {Hash|Hmac}  hash
	 *  @memberof  Updater
	 */
	static object(hash, value) {
		if (value === null) {
			return this.string(hash, 'NULL');
		}

		return Object.keys(value)
			.sort((one, two) => -Number(one < two) || Number(one > two))
			.reduce((sum, key) => this.update(this.update(sum, key), value[key]), hash);
	}

	/**
	 *  Update the hash using an array as input
	 *
	 *  @static
	 *  @param     {Hash|Hmac}  hash
	 *  @param     {Array}      value
	 *  @return    {Hash|Hmac}  hash
	 *  @memberof  Updater
	 */
	static array(hash, value) {
		return value.reduce((sum, val) => this.update(sum, val), hash);
	}

	/**
	 *  Update the hash using boolean input
	 *
	 *  @static
	 *  @param     {Hash|Hmac}  hash
	 *  @param     {Boolean}    value
	 *  @return    {Hash|Hmac}  hash
	 *  @memberof  Updater
	 */
	static boolean(hash, value) {
		return hash.update(value ? 'true' : 'false');
	}

	/**
	 *  Update the hash using an undefined value as input
	 *
	 *  @static
	 *  @param     {Hash|Hmac}  hash
	 *  @return    {Hash|Hmac}  hash
	 *  @memberof  Updater
	 */
	static undefined(hash) {
		return hash.update('undefined');
	}
}

module.exports = Updater;
