const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function RetrieveMessageNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get options from node's configuration
            let options = {
                encoding: config.encoding,
                async: config.async
            };

            if (util.checkIntNumberStr(config.dataChunkSize)) {
                options.dataChunkSize = parseInt(config.dataChunkSize);
            }

            let messageId;

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

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.readMessage(messageId, options, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("read message", RetrieveMessageNode);
}
