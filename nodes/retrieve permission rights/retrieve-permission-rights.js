/*
* @Author: mahesh
* @Date:   2018-01-13 21:22:38
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var merge = require('merge');

module.exports = function(RED) {
    function RetrievePermissionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            var payload = merge(true, config, msg.payload);
            var device = RED.nodes.getNode(payload.device);

            var ctnApiClient = device.ctnApiClient;
            ctnApiClient.retrievePermissionRights(payload.eventName, responseHandler.bind(node, {}));
        });
    }

    RED.nodes.registerType("retrieve permission right", RetrievePermissionNode);

    RED.httpAdmin.post("/catenis.retrievepermissionright/:id", RED.auth.needsPermission("catenis.retrievepermissionright"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Could not retrieve permission rights.");
            }
        } else {
            res.sendStatus(404);
        }
    });
}
