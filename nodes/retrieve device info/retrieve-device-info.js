/*
* @Author: Mahesh J
* @Date:   2018-01-05 19:46:47
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');

module.exports = function(RED) {
    function retrieveDeviceInfoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var device = RED.nodes.getNode(config.device);
        var deviceId = config.deviceId;
        var isProdUniqueId = config.isProdUniqueId;

        node.on('input', function(msg) {
            var ctnApiClient = device.ctnApiClient;
            ctnApiClient.retrieveDeviceIdentificationInfo(deviceId, isProdUniqueId, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("retrieve device info", retrieveDeviceInfoNode);
}

