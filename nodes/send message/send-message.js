/*
* @Author: Mahesh J
* @Date:   2018-01-02 17:41:33
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function SendMessageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var fromDevice = RED.nodes.getNode(config.fromDevice);
        var toDeviceId = config.toDeviceId;
        var isProdUniqueId = config.isProdUniqueId;

        var targetDevice = {
            id: config.toDeviceId,
            isProdUniqueId: config.isProdUniqueId
        }

        node.on('input', function(msg) {
            var ctnApiClient = fromDevice.ctnApiClient;

            // Get options from node's configuration
            var opts = {
                encoding: config.encoding,
                encrypt: config.encrypt,
                storage: config.storage,
                readConfirmation: config.readConfirmation
            };

            var message;

            if (typeof msg.payload === 'string') {
                // Assume that payload contains the message to log
                message = msg.payload;
            }
            else if (util.checkNonNullObject(msg.payload)) {
                // Get message to log
                message = msg.payload.message;

                if (util.checkNonNullObject(msg.payload.targetDevice)) {

                    if (msg.payload.targetDevice.id) {
                        targetDevice.id = msg.payload.targetDevice.id;
                    }

                    if (msg.payload.targetDevice.isProdUniqueId) {
                        targetDevice.isProdUniqueId = msg.payload.targetDevice.isProdUniqueId;
                    }
                }

                if (typeof msg.payload.options === 'object' && msg.payload.options !== null) {
                    // Payload has options. Override them as appropriate
                    if (msg.payload.options.encoding) {
                        opts.encoding = msg.payload.options.encoding;
                    }

                    if (msg.payload.options.encrypt) {
                        opts.encrypt = msg.payload.options.encrypt;
                    }

                    if (msg.payload.options.storage) {
                        opts.storage = msg.payload.options.storage;
                    }

                    if (msg.payload.options.readConfirmation) {
                        opts.readConfirmation = msg.payload.options.readConfirmation;
                    }
                }
            }

            ctnApiClient.sendMessage(targetDevice, message, opts, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("send message", SendMessageNode);
}
