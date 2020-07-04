const responseHandler = require('../../util/catenis-api-response-handler.js');

module.exports = function(RED) {
    function RetrievePermissionNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function() {
            const connection = RED.nodes.getNode(config.connection);

            const ctnApiClient = connection.ctnApiClient;
            ctnApiClient.listNotificationEvents(responseHandler.bind(node, {}));
        });
    }

    RED.nodes.registerType("list notification events", RetrievePermissionNode);

    RED.httpAdmin.post("/catenis.listnotificationevents/:id", RED.auth.needsPermission("catenis.listnotificationevents"), function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.listnotificationevents/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
}
