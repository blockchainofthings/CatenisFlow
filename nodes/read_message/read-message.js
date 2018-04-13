/*
* @Author: Mahesh J
* @Date:   2017-12-26 18:03:50
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function RetrieveMessageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            var encoding = config.encoding;

            var messageId;

            if (util.checkNonBlankStr(msg.payload)) {
                messageId = msg.payload.trim();
            }
            else if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonEmptyStr(msg.payload.messageId)) {
                    messageId = msg.payload.messageId;
                }
                if (util.checkNonEmptyStr(msg.payload.encoding)) {
                    encoding = msg.payload.encoding;
                }
            }

            if (messageId === undefined) {
                return node.error('Missing required parameter \'messageId\'', msg);
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.readMessage(messageId, encoding, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("read message", RetrieveMessageNode);
}
