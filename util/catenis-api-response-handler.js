const CatenisApiError = require('catenis-api-client/lib/CatenisApiError');

exports = module.exports = function (msg, err, data) {
	const node = this;
	if (err) {
		const errMsg = err instanceof CatenisApiError ? err.message : err.toString();
		return node.error(errMsg, msg);
	}
	// Success. Retrieve returned data
	msg.payload = data;
	node.send(msg);
}
