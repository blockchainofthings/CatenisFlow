/*
* @Author: Mahesh J
* @Date:   2018-01-09 19:29:59
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var merge = require('merge');

module.exports = function(RED) {

    function clearWSNtfyChannel(channel, node) {
        if (channel) {
            channel.close();
            channel.removeAllListeners();
        }
        node.status({ fill:"red", shape:"dot", text:"disconnected" });
    }

    function openWsNtfyChannel(node, ctnApiClient, eventName) {
        var wsNtfyChannel = ctnApiClient.createWsNotifyChannel(eventName);

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
                node.status({ fill:"green", shape:"dot", text:"connected - " + eventName });
            }
        });

        return wsNtfyChannel;
    }

    function NotificationChannelNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var wsNtfyChannel;

        node.on('input', function (msg) {
            var payload = merge(true, config, msg.payload);
            var device = RED.nodes.getNode(payload.device);

            var ctnApiClient = device.ctnApiClient;

            if (payload.action) {
                clearWSNtfyChannel(wsNtfyChannel, node);
                if (payload.action === 'open') {
                    wsNtfyChannel = openWsNtfyChannel(node, ctnApiClient, payload.eventName);
                }
            } else {
                if (wsNtfyChannel) {
                    clearWSNtfyChannel(wsNtfyChannel, node);
                    wsNtfyChannel = undefined;
                } else {
                    wsNtfyChannel = openWsNtfyChannel(node, ctnApiClient, payload.eventName);
                }
            }
        })

        node.on('close', function() {
            // cleanup - close ws connection
            if (wsNtfyChannel) {
                clearWSNtfyChannel(wsNtfyChannel);
                wsNtfyChannel = undefined;
            }
        });
    }

    RED.nodes.registerType("notification channel", NotificationChannelNode);

    RED.httpAdmin.post("/catenis.notificationchannel/:id", RED.auth.needsPermission("catenis.notificationchannel"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Check permission failed.");
            }
        } else {
            res.sendStatus(404);
        }
    });
}
