/*
* @Author: Mahesh J
* @Date:   2018-01-12 19:54:14
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var merge = require('merge');

module.exports = function(RED) {
    function CheckPermissionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            var payload = merge(true, config, msg.payload);
            var device = RED.nodes.getNode(payload.device);

            var ctnApiClient = device.ctnApiClient;
            ctnApiClient.checkEffectivePermissionRight(payload.event, payload.deviceId, payload.isProdUniqueId, responseHandler.bind(node, {}));
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
                node.error("Check permission failed.");
            }
        } else {
            res.sendStatus(404);
        }
    });
}
