/*
* @Author: Mahesh J
* @Date:   2018-01-02 23:01:37
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function ListMessagesNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            var options = {
                action: config.action,
                direction: config.direction,
                readState: config.readState
            };

            var trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.fromDeviceIds.trim())) {
                options.fromDeviceIds = trimmedStr;
            }
            if (util.checkNonEmptyStr(trimmedStr = config.toDeviceIds.trim())) {
                options.toDeviceIds = trimmedStr;
            }
            if (util.checkNonEmptyStr(trimmedStr = config.fromDeviceProdUniqueIds.trim())) {
                options.fromDeviceProdUniqueIds = trimmedStr;
            }
            if (util.checkNonEmptyStr(trimmedStr = config.toDeviceProdUniqueIds.trim())) {
                options.toDeviceProdUniqueIds = trimmedStr;
            }
            if (util.checkNonEmptyStr(trimmedStr = config.startDate.trim())) {
                options.startDate = trimmedStr;
            }
            if (util.checkNonEmptyStr(trimmedStr = config.endDate.trim())) {
                options.endDate = trimmedStr;
            }

            if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonEmptyStr(msg.payload.action)) {
                    options.action = msg.payload.action;
                }
                if (util.checkNonEmptyStr(msg.payload.direction)) {
                    options.direction = msg.payload.direction;
                }
                if (util.checkNonEmptyStr(msg.payload.fromDeviceIds)) {
                    options.fromDeviceIds = msg.payload.fromDeviceIds;
                }
                if (util.checkNonEmptyStr(msg.payload.toDeviceIds)) {
                    options.toDeviceIds = msg.payload.toDeviceIds;
                }
                if (util.checkNonEmptyStr(msg.payload.fromDeviceProdUniqueIds)) {
                    options.fromDeviceProdUniqueIds = msg.payload.fromDeviceProdUniqueIds;
                }
                if (util.checkNonEmptyStr(msg.payload.toDeviceProdUniqueIds)) {
                    options.toDeviceProdUniqueIds = msg.payload.toDeviceProdUniqueIds;
                }
                if (util.checkNonEmptyStr(msg.payload.startDate)) {
                    options.startDate = msg.payload.startDate;
                }
                if (util.checkNonEmptyStr(msg.payload.endDate)) {
                    options.endDate = msg.payload.endDate;
                }
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.listMessages(options, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("list messages", ListMessagesNode);

    RED.httpAdmin.post("/catenis.listmessages/:id", RED.auth.needsPermission("catenis.listmessages"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.listmessages/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
}

