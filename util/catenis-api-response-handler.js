/*
* @Author: Mahesh J
* @Date:   2017-12-29 12:22:56
*/

exports = module.exports = function (msg, errMsg, err, data) {
	var node = this;
	if (err) {
		if (err.apiError) {
			return node.error(errMsg, {
				returnedError: err,
				originalMsg: msg
			});
		} else {
			return node.error(err.clientError.message, err);
		}
	}
	// Success. Retrieve returned data
	msg.payload = data.data;
	node.send(msg);
}
