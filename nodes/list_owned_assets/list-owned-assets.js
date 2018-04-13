
var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function listOwnedAssets(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            // Get parameters from node's configuration
            var limit,
                skip;

            if (util.checkIntNumberStr(config.limit)) {
                limit = parseInt(config.limit);
            }

            if (util.checkIntNumberStr(config.skip)) {
                skip = parseInt(config.skip);
            }

            if (util.checkNonNullObject(msg.payload)) {
                // Check if any parameters present in payload
                if (util.checkNumber(msg.payload.limit)) {
                    limit = msg.payload.limit;
                }
                
                if (util.checkNumber(msg.payload.skip)) {
                    skip = msg.payload.skip;
                }
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.listOwnedAssets(limit, skip, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("list owned assets", listOwnedAssets);

    RED.httpAdmin.post("/catenis.listownedassets/:id", RED.auth.needsPermission("catenis.listownedassets"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.listownedassets/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
};
