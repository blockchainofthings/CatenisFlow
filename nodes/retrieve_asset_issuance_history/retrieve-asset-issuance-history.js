const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function retrieveAssetIssuanceHistoryNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get parameters from node's configuration
            let assetId,
                startDate,
                endDate,
                limit,
                skip;
            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.assetId.trim())) {
                assetId = trimmedStr;
            }

            if (util.checkNonEmptyStr(trimmedStr = config.startDate.trim())) {
                startDate = trimmedStr;
            }

            if (util.checkNonEmptyStr(trimmedStr = config.endDate.trim())) {
                endDate = trimmedStr;
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

                if (util.checkNonEmptyStr(msg.payload.startDate)) {
                    startDate = msg.payload.startDate;
                }

                if (util.checkNonEmptyStr(msg.payload.endDate)) {
                    endDate = msg.payload.endDate;
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

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.retrieveAssetIssuanceHistory(assetId, startDate, endDate, limit, skip, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("retrieve asset issuance history", retrieveAssetIssuanceHistoryNode);

    RED.httpAdmin.post("/catenis.retrieveassetissuancehistory/:id", RED.auth.needsPermission("catenis.retrieveassetissuancehistory"), function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.retrieveassetissuancehistory/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
};
