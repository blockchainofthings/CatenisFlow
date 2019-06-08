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
            // Get options from node's configuration
            var options = {
                encoding: config.encoding,
                async: config.async
            };

            if (util.checkIntNumberStr(config.dataChunkSize)) {
                options.dataChunkSize = parseInt(config.dataChunkSize);
            }

            var messageId;

            if (util.checkNonBlankStr(msg.payload)) {
                messageId = msg.payload.trim();
            }
            else if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonEmptyStr(msg.payload.messageId)) {
                    messageId = msg.payload.messageId;
                }

                if (util.checkNonEmptyStr(msg.payload.options)) {
                    // Assume that this is the encoding of the message
                    options = msg.payload.options;
                }
                else if (util.checkNonNullObject(msg.payload.options)) {
                    // Payload has options. Override them as appropriate
                    if (util.checkNonEmptyStr(msg.payload.options.encoding)) {
                        options.encoding = msg.payload.options.encoding;
                    }

                    if (util.checkNonEmptyStr(msg.payload.options.continuationToken)) {
                        options.continuationToken = msg.payload.options.continuationToken;
                    }

                    if (util.checkNumber(msg.payload.options.dataChunkSize)) {
                        options.dataChunkSize = msg.payload.options.dataChunkSize;
                    }
                    else if (msg.payload.options.dataChunkSize === null) {
                        delete options.dataChunkSize;
                    }

                    if (util.checkNonEmpty(msg.payload.options.async)) {
                        options.async = !!msg.payload.options.async;
                    }
                }
            }

            if (messageId === undefined) {
                return node.error('Missing required parameter \'messageId\'', msg);
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.readMessage(messageId, options, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("read message", RetrieveMessageNode);
}
