/*
* @Author: mahesh
* @Date:   2018-01-19 17:53:12
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');

module.exports = function(RED) {
    function RetrievePermissionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function() {
            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.listPermissionEvents(responseHandler.bind(node, {}));
        });
    }

    RED.nodes.registerType("list permission events", RetrievePermissionNode);

    RED.httpAdmin.post("/catenis.listpermissionevents/:id", RED.auth.needsPermission("catenis.listpermissionevents"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.listpermissionevents/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
}
