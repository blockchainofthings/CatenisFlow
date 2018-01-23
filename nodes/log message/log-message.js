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
        var device = RED.nodes.getNode(config.device);

        node.on('input', function(msg) {
            var ctnApiClient = device.ctnApiClient;

            // Get options from node's configuration
            var opts = {
                encoding: config.encoding,
                encrypt: config.encrypt,
                storage: config.storage
            };

            var message;

            if (typeof msg.payload === 'string') {
                // Assume that payload contains the message to log
                message = msg.payload;
            }
            else if (util.checkNonNullObject(msg.payload)) {
                // Get message to log
                message = msg.payload.message;

                if (checkNonNullObject(msg.payload.options)) {
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
                }
            }

            // Call Catenis API to log message
            ctnApiClient.logMessage(message, opts, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("log message", LogMessageNode);
}
