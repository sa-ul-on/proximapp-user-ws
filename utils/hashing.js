const crypto = require('crypto');

module.exports = function (str) {
	const hash = crypto.createHash('sha512');
	const data = hash.update(str, 'utf-8')
	return data.digest('hex');
};
