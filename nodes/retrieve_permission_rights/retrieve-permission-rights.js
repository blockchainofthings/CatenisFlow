const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function RetrievePermissionNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            let trimmedStr;
            let eventName = util.checkNonEmptyStr(trimmedStr = config.eventName.trim()) ? trimmedStr : undefined;

            if (util.checkNonBlankStr(msg.payload)) {
                eventName = msg.payload.trim();
            }

            if (eventName === undefined) {
                return node.error('Missing required parameter \'eventName\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.retrievePermissionRights(eventName, responseHandler.bind(node, {}));
        });
    }

    RED.nodes.registerType("retrieve permission rights", RetrievePermissionNode);

    RED.httpAdmin.post("/catenis.retrievepermissionright/:id", RED.auth.needsPermission("catenis.retrievepermissionright"), function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
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
