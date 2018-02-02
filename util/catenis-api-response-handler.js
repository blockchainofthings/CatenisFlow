/*
* @Author: Mahesh J
* @Date:   2017-12-29 12:22:56
*/

var util = require('util');

exports = module.exports = function (msg, err, data) {
	var node = this;
	if (err) {
		var errMsg = err.clientError ? err.clientError.toString() : util.format('[%d] - %s', err.apiError.httpStatusCode, err.apiError.message);
		return node.error(errMsg, msg);
	}
	// Success. Retrieve returned data
	msg.payload = data.data;
	node.send(msg);
}
