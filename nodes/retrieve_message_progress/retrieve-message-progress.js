/*
* @Author: Cláudio de Castro
* @Date:   2019-06-03
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function RetrieveMessageProgressNode(config) {
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

            ctnApiClient.retrieveMessageProgress(messageId, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("retrieve message progress", RetrieveMessageProgressNode);
};
