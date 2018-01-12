/*
* @Author: Mahesh J
* @Date:   2017-12-26 12:31:27
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');

module.exports = function(RED) {
    function RetrieveMessageContainerNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.device = RED.nodes.getNode(config.device);
        var ctnApiClient = this.device.ctnApiClient;

        node.on('input', function(msg) {
        	ctnApiClient.retrieveMessageContainer(msg.payload.messageId, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("retrieve message container", RetrieveMessageContainerNode);
}
