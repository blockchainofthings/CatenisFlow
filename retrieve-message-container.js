/*
* @Author: Mahesh J
* @Date:   2017-12-26 12:31:27
*/

module.exports = function(RED) {
    function RetrieveMessageContainerNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.device = RED.nodes.getNode(config.device);
        var ctnApiClient = this.device.ctnApiClient;

        node.on('input', function(msg) {
        	ctnApiClient.retrieveMessageContainer(msg.payload.messageId, function (err, data) {
        		msg.payload = data.data;
        		node.send(msg);
        	});
        });
    }
    RED.nodes.registerType("retrieve message container", RetrieveMessageContainerNode);
}
