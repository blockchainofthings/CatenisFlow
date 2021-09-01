const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function assetExportOutcome(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get asset ID and foreign blockchain from node's configuration
            let assetId;
            let foreignBlockchain;
            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.assetId.trim())) {
                assetId = trimmedStr;
            }

            if (util.checkNonEmptyStr(trimmedStr = config.foreignBlockchain.trim())) {
                foreignBlockchain = trimmedStr;
            }

            if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonBlankStr(msg.payload.assetId)) {
                    // Assume that payload contains the asset ID
                    assetId = msg.payload.assetId.trim();
                }

                if (util.checkNonBlankStr(msg.payload.foreignBlockchain)) {
                    // Assume that payload contains the foreign blockchain
                    foreignBlockchain = msg.payload.foreignBlockchain.trim();
                }
            }

            const missedParams = [];

            if (assetId === undefined) {
                missedParams.push('\'assetId\'');
            }

            if (foreignBlockchain === undefined) {
                missedParams.push('\'foreignBlockchain\'');
            }

            if (missedParams.length > 0) {
                return node.error('Missing required parameter' + (missedParams.length > 1 ? 's: ' : ': ') + missedParams.join(', '), msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.assetExportOutcome(assetId, foreignBlockchain, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("asset export outcome", assetExportOutcome);

    RED.httpAdmin.post("/catenis.assetexportoutcome/:id", RED.auth.needsPermission("catenis.assetexportoutcome"), function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.assetexportoutcome/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
};
