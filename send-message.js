/*
* @Author: Mahesh J
* @Date:   2018-01-02 17:41:33
*/

var responseHandler = require('./util/catenis-api-response-handler.js');

module.exports = function(RED) {
    function SendMessageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var fromDevice = RED.nodes.getNode(config.fromDevice);
        var toDeviceId = config.toDeviceId;
        var isProdUniqueId = config.isProdUniqueId;

        node.on('input', function(msg) {
            var ctnApiClient = fromDevice.ctnApiClient;
            ctnApiClient.sendMessage({
                id: toDeviceId,
                isProdUniqueId: isProdUniqueId
            }, msg.payload, {
                encoding: config.encoding,
                encrypt: config.encrypt,
                storage: config.storage,
                readConfirmation: config.readConfirmation
            }, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("send message", SendMessageNode);
}
