/*
* @Author: Mahesh J
* @Date:   2018-01-09 19:29:59
*/

var util = require('../../util');

module.exports = function(RED) {

    function NotificationChannelNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // Instantiate Web Services notification channel
        var device = RED.nodes.getNode(config.device);
        var ctnApiClient = device.ctnApiClient;

        node.wsNtfyChannel = ctnApiClient.createWsNotifyChannel(config.eventName);

        node.wsNtfyChannel.addListener('error', function (error) {
            node.error(error.toString());
        });

        node.wsNtfyChannel.addListener('close', function (code, reason) {
            node.channelOpen = false;
            node.status({ fill:'red', shape:'dot', text:'disconnected' + (code ? ' - [' + code + ']' + (reason ? ' - ' + reason : '') : '') });
        });

        node.wsNtfyChannel.addListener('open', function () {
            node.channelOpen = true;
            node.status({ fill:'green', shape:'dot', text:'connected' });
        });

        node.wsNtfyChannel.addListener('notify', function (data) {
            node.send({payload: data});
        });

        function wsOpenHandler(err) {
            if (err) {
                node.error(err.toString());
            }
        }

        node.channelOpen = false;
        node.status({ fill:'red', shape:'dot', text:'disconnected' });

        node.on('input', function (msg) {
            var action = node.channelOpen ? 'close' : 'open';

            if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonEmptyStr(msg.payload.action)) {
                    if (msg.payload.action === 'close' || msg.payload.action === 'open') {
                        action = msg.payload.action;
                    }
                }
            }

            switch (action) {
                case 'open':
                    if (node.wsNtfyChannel && !node.channelOpen) {
                        node.wsNtfyChannel.open(wsOpenHandler);
                    }
                    break;

                case 'close':
                    if (node.wsNtfyChannel && node.channelOpen) {
                        node.wsNtfyChannel.close();
                    }
                    break;
            }
        });

        node.on('close', function() {
            if (node.wsNtfyChannel) {
                node.wsNtfyChannel.close();
            }
        });
    }

    RED.nodes.registerType('notification channel', NotificationChannelNode);

    RED.httpAdmin.post('/catenis.notificationchannel/:id', RED.auth.needsPermission('catenis.notificationchannel'), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.notificationchannel/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
}
