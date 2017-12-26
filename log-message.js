/*
* @Author: mahesh
* @Date:   2017-12-23 22:02:03
*/

module.exports = function(RED) {
    function LogMessageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.device = RED.nodes.getNode(config.device);
        let ctnApiClient = this.device.ctnApiClient;

        node.on('input', function(msg) {

            ctnApiClient.logMessage(msg.payload, {
        	    encoding: config.encoding,
        	    encrypt: config.encrypt,
        	    storage: config.storage
        	}, function (err, data) {
        		let lastMsgId;
        		if (!err && typeof data.data === 'object' && data.data !== null && typeof data.data.messageId === 'string') {
        		    lastMsgId = data.data.messageId;
        		}
        		msg.payload = lastMsgId;
        		node.send(msg);
        	});
        });
    }
    RED.nodes.registerType("log message", LogMessageNode);
}
