/*
* @Author: Mahesh J
* @Date:   2017-12-26 12:31:27
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function RetrieveMessageContainerNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            var messageId;

            if (util.checkNonBlankStr(msg.payload)) {
                messageId = msg.payload.trim();
            }
            else {
                return node.error('Missing required parameter \'messageId\'', msg);
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

        	ctnApiClient.retrieveMessageContainer(messageId, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("retrieve message container", RetrieveMessageContainerNode);
}
