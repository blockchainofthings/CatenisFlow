/*
* @Author: mahesh
* @Date:   2017-12-23 22:02:03
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function LogMessageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            // Get options from node's configuration
            var options = {
                encoding: config.encoding,
                encrypt: config.encrypt,
                storage: config.storage,
                async: config.async
            };

            var message;

            if (util.checkNonEmptyStr(msg.payload)) {
                // Assume that payload contains the message to log
                message = msg.payload;
            }
            else if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonEmptyStr(msg.payload.message) || util.checkNonNullObject(msg.payload.message)) {
                    // Get message to log
                    message = msg.payload.message;
                }

                if (util.checkNonNullObject(msg.payload.options)) {
                    // Payload has options. Override them as appropriate
                    if (util.checkNonEmptyStr(msg.payload.options.encoding)) {
                        options.encoding = msg.payload.options.encoding;
                    }

                    if (util.checkNonEmpty(msg.payload.options.encrypt)) {
                        options.encrypt = !!msg.payload.options.encrypt;
                    }

                    if (util.checkNonEmptyStr(msg.payload.options.storage)) {
                        options.storage = msg.payload.options.storage;
                    }

                    if (util.checkNonEmpty(msg.payload.options.async)) {
                        options.async = !!msg.payload.options.async;
                    }
                }
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            // Call Catenis API to log message
            ctnApiClient.logMessage(message, options, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("log message", LogMessageNode);
}
