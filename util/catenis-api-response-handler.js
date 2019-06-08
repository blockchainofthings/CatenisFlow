/*
* @Author: Mahesh J
* @Date:   2017-12-29 12:22:56
*/

var util = require('util');
var CatenisApiError = require('catenis-api-client/lib/CatenisApiError');

exports = module.exports = function (msg, err, data) {
	var node = this;
	if (err) {
		var errMsg = err instanceof CatenisApiError ? err.message : err.toString();
		return node.error(errMsg, msg);
	}
	// Success. Retrieve returned data
	msg.payload = data;
	node.send(msg);
}
