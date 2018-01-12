/*
* @Author: Mahesh J
* @Date:   2018-01-09 19:29:59
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');

module.exports = function(RED) {
    function NotificationChannelNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var device = RED.nodes.getNode(config.device);

        var ctnApiClient = device.ctnApiClient;
        var wsNtfyChannel;

        if (config.state === 'connected') {
            wsNtfyChannel = ctnApiClient.createWsNotifyChannel(config.event);

            wsNtfyChannel.addListener('error', function (error) {
                node.error(error.message);
            });

            wsNtfyChannel.addListener('close', function () {
                node.status({ fill:"red", shape:"dot", text:"disconnected" });
            });

            wsNtfyChannel.addListener('message', function (data) {
                node.send(JSON.parse(data));
            });

            wsNtfyChannel.open(function (err) {
                if (err) {
                    node.status({ fill:"red", shape:"dot", text:"error connecting" });
                } else {
                    node.status({ fill:"green", shape:"dot", text:"connected - " + config.event });
                }
            });
        } else {
            node.status({ fill:"red", shape:"dot", text:"disconnected" });
        }

        this.on('close', function() {
            // cleanup - close ws connection
            if (wsNtfyChannel) {
                wsNtfyChannel.close();
            }
        });
    }

    RED.nodes.registerType("notification channel", NotificationChannelNode);
}
