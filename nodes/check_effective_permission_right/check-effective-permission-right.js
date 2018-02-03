/*
* @Author: Mahesh J
* @Date:   2018-01-12 19:54:14
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function CheckPermissionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            var params = {
                eventName: config.eventName,
                isProdUniqueId: config.isProdUniqueId
            };

            var trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.deviceId.trim())) {
                params.deviceId = trimmedStr;
            }

            if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonEmptyStr(msg.payload.eventName)) {
                    params.eventName = msg.payload.eventName;
                }
                if (util.checkNonEmptyStr(msg.payload.deviceId)) {
                    params.deviceId = msg.payload.deviceId;
                }
                if (msg.payload.isProdUniqueId !== undefined && msg.payload.isProdUniqueId !== null) {
                    params.isProdUniqueId = !!msg.payload.isProdUniqueId;
                }
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.checkEffectivePermissionRight(params.eventName, params.deviceId, params.isProdUniqueId, responseHandler.bind(node, {}));
        });
    }

    RED.nodes.registerType("check effective permission right", CheckPermissionNode);

    RED.httpAdmin.post("/catenis.checkpermission/:id", RED.auth.needsPermission("catenis.checkpermission"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.checkpermission/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
}
