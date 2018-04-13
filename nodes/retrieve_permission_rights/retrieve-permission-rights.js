/*
* @Author: mahesh
* @Date:   2018-01-13 21:22:38
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function RetrievePermissionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            var eventName = config.eventName;

            if (util.checkNonBlankStr(msg.payload)) {
                eventName = msg.payload.trim()
            }
            else {
                return node.error('Missing required parameter \'eventName\'', msg);
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.retrievePermissionRights(eventName, responseHandler.bind(node, {}));
        });
    }

    RED.nodes.registerType("retrieve permission rights", RetrievePermissionNode);

    RED.httpAdmin.post("/catenis.retrievepermissionright/:id", RED.auth.needsPermission("catenis.retrievepermissionright"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.retrievepermissionright/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
}
