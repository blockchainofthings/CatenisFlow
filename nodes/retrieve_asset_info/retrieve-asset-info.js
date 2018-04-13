
var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function retrieveAssetInfoNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            // Get asset ID from node's configuration
            var assetId;
            var trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.assetId.trim())) {
                assetId = trimmedStr;
            }

            if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonBlankStr(msg.payload.assetId)) {
                    // Assume that payload contains the asset ID
                    assetId = msg.payload.assetId.trim();
                }
            }

            if (assetId === undefined) {
                return node.error('Missing required parameter \'assetId\'', msg);
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.retrieveAssetInfo(assetId, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("retrieve asset info", retrieveAssetInfoNode);

    RED.httpAdmin.post("/catenis.retrieveassetinfo/:id", RED.auth.needsPermission("catenis.retrieveassetinfo"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.retrieveassetinfo/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
};
