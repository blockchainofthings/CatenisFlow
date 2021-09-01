const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function assetMigrationOutcome(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get migration ID from node's configuration
            let migrationId;
            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.migrationId.trim())) {
                migrationId = trimmedStr;
            }

            if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonBlankStr(msg.payload.migrationId)) {
                    // Assume that payload contains the migration ID
                    migrationId = msg.payload.migrationId.trim();
                }
            }

            if (migrationId === undefined) {
                return node.error('Missing required parameter: \'migrationId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.assetMigrationOutcome(migrationId, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("asset migration outcome", assetMigrationOutcome);

    RED.httpAdmin.post("/catenis.assetmigrationoutcome/:id", RED.auth.needsPermission("catenis.assetmigrationoutcome"), function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.assetmigrationoutcome/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
};
