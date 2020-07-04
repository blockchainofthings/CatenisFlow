const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function SendMessageNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get target device from node's configuration
            let targetDevice = {
                isProdUniqueId: config.isProdUniqueId
            };

            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.toDeviceId.trim())) {
                targetDevice.id = trimmedStr;
            }

            // Get options from node's configuration
            const options = {
                encoding: config.encoding,
                encrypt: config.encrypt,
                offChain: config.offChain,
                storage: config.storage,
                readConfirmation: config.readConfirmation,
                async: config.async
            };

            let message;

            if (util.checkNonEmptyStr(msg.payload)) {
                // Assume that payload contains the message to log
                message = msg.payload;
            }
            else if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonEmptyStr(msg.payload.message) || util.checkNonNullObject(msg.payload.message)) {
                    // Get message to send
                    message = msg.payload.message;
                }

                if (util.checkNonNullObject(msg.payload.targetDevice)) {
                    if (util.checkNonEmptyStr(msg.payload.targetDevice.id)) {
                        targetDevice.id = msg.payload.targetDevice.id;
                    }

                    if (util.checkNonEmpty(msg.payload.targetDevice.isProdUniqueId)) {
                        targetDevice.isProdUniqueId = !!msg.payload.targetDevice.isProdUniqueId;
                    }
                }

                if (util.checkNonNullObject(msg.payload.options)) {
                    // Payload has options. Override them as appropriate
                    if (msg.payload.options.readConfirmation) {
                        options.readConfirmation = msg.payload.options.readConfirmation;
                    }

                    if (util.checkNonEmptyStr(msg.payload.options.encoding)) {
                        options.encoding = msg.payload.options.encoding;
                    }

                    if (util.checkNonEmpty(msg.payload.options.encrypt)) {
                        options.encrypt = !!msg.payload.options.encrypt;
                    }

                    if (util.checkNonEmpty(msg.payload.options.offChain)) {
                        options.offChain = !!msg.payload.options.offChain;
                    }

                    if (util.checkNonEmptyStr(msg.payload.options.storage)) {
                        options.storage = msg.payload.options.storage;
                    }

                    if (util.checkNonEmpty(msg.payload.options.async)) {
                        options.async = !!msg.payload.options.async;
                    }
                }
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.sendMessage(message, targetDevice, options, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("send message", SendMessageNode);
}
