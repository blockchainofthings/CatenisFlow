/*
* @Author: Mahesh J
* @Date:   2017-12-26 18:03:50
*/

module.exports = function(RED) {
    function RetrieveMessageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.device = RED.nodes.getNode(config.device);
        var ctnApiClient = this.device.ctnApiClient;

        node.on('input', function(msg) {
            ctnApiClient.readMessage(msg.payload.messageId, config.encoding, function (err, data) {
            	console.log(data);
        		if (!err && typeof data.data === 'object' && data.data !== null) {
        		    msg.payload = data.data;
        		}
        		node.send(msg);
        	});
        });
    }
    RED.nodes.registerType("retrieve message", RetrieveMessageNode);
}
