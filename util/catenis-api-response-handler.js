/*
* @Author: Mahesh J
* @Date:   2017-12-29 12:22:56
*/

exports = module.exports = function (node, msg, err, data) {
	if (err) {
		if (err.apiError) {
			return node.error(err.apiError.message, msg);
		} else {
			return node.error(err.clientError.message, msg);
		}
	}
	if (data.status !== 'success') {
	    return node.error(data, msg);
	}
	// Success. Retrieve returned data
	msg.payload = data.data;
	node.send(msg);
}
