/*
* @Author: mahesh
* @Date:   2018-01-13 21:22:38
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
            ctnApiClient.retrievePermissionRights(event, responseHandler.bind(node, {}));
        });
    }

    RED.nodes.registerType("retrieve permission right", CheckPermissionNode);

    RED.httpAdmin.post("/catenis.retrievepermissionright/:id", RED.auth.needsPermission("catenis.retrievepermissionright"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error(RED._("catenis.retrievepermissionright.failed", { error: err.toString() }));
            }
        } else {
            res.sendStatus(404);
        }
    });
}
