/*
* @Author: Mahesh J
* @Date:   2018-01-12 19:54:14
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');

module.exports = function(RED) {
    function CheckPermissionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var device = RED.nodes.getNode(config.device);
        var deviceId = config.deviceId;
        var isProdUniqueId = config.isProdUniqueId;
        var event = config.event;

        node.on('input', function() {
            var ctnApiClient = device.ctnApiClient;
            ctnApiClient.checkEffectivePermissionRight(event, deviceId, isProdUniqueId, responseHandler.bind(node, {}));
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
