
var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function listAssetHolders(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            // Get parameters from node's configuration
            var assetId,
                limit,
                skip;
            var trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.assetId.trim())) {
                assetId = trimmedStr;
            }

            if (util.checkIntNumberStr(config.limit)) {
                limit = parseInt(config.limit);
            }

            if (util.checkIntNumberStr(config.skip)) {
                skip = parseInt(config.skip);
            }

            if (util.checkNonNullObject(msg.payload)) {
                // Check if any parameters present in payload
                if (util.checkNonBlankStr(msg.payload.assetId)) {
                    assetId = msg.payload.assetId.trim();
                }

                if (util.checkNumber(msg.payload.limit)) {
                    limit = msg.payload.limit;
                }

                if (util.checkNumber(msg.payload.skip)) {
                    skip = msg.payload.skip;
                }
            }

            if (assetId === undefined) {
                return node.error('Missing required parameter \'assetId\'', msg);
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.listAssetHolders(assetId, limit, skip, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("list asset holders", listAssetHolders);

    RED.httpAdmin.post("/catenis.listassetholders/:id", RED.auth.needsPermission("catenis.listassetholders"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.listassetholders/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
};
