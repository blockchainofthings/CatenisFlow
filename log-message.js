/*
* @Author: mahesh
* @Date:   2017-12-23 22:02:03
*/

var responseHandler = require('./util/catenis-api-response-handler.js');

module.exports = function(RED) {
    function LogMessageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var device = RED.nodes.getNode(config.device);

        node.on('input', function(msg) {
            var ctnApiClient = device.ctnApiClient;
            ctnApiClient.logMessage(msg.payload, {
                encoding: config.encoding,
                encrypt: config.encrypt,
                storage: config.storage
            }, responseHandler.bind(node, msg, 'Error logging message'));
        });
    }
    RED.nodes.registerType("log message", LogMessageNode);
}
