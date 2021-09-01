const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function listExportedAssets(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get parameters from node's configuration
            const selector = {
                negateStatus: config.negateStatus
            };
            let limit,
                skip;
            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.assetId.trim())) {
                selector.assetId = trimmedStr;
            }

            if (util.checkNonEmptyStr(trimmedStr = config.foreignBlockchain.trim())) {
                selector.foreignBlockchain = trimmedStr;
            }

            if (util.checkNonEmptyStr(trimmedStr = config.tokenSymbol.trim())) {
                selector.tokenSymbol = trimmedStr;
            }

            if (util.checkNonEmptyStr(trimmedStr = config.status.trim())) {
                selector.status = trimmedStr;
            }

            if (util.checkNonEmptyStr(trimmedStr = config.startDate.trim())) {
                selector.startDate = trimmedStr;
            }

            if (util.checkNonEmptyStr(trimmedStr = config.endDate.trim())) {
                selector.endDate = trimmedStr;
            }

            if (util.checkIntNumberStr(config.limit)) {
                limit = parseInt(config.limit);
            }

            if (util.checkIntNumberStr(config.skip)) {
                skip = parseInt(config.skip);
            }

            if (util.checkNonNullObject(msg.payload)) {
                // Check if any parameters present in payload
                if (util.checkNonNullObject(msg.payload.selector)) {
                    if (msg.payload.selector.assetId !== null) {
                        if (util.checkNonEmptyStr(msg.payload.selector.assetId)) {
                            selector.assetId = msg.payload.selector.assetId;
                        }
                    }
                    else {
                        // Indication that parameter should not be included in search criteria
                        selector.assetId = undefined;
                    }

                    if (msg.payload.selector.foreignBlockchain !== null) {
                        if (util.checkNonEmptyStr(msg.payload.selector.foreignBlockchain)) {
                            selector.foreignBlockchain = msg.payload.selector.foreignBlockchain;
                        }
                    }
                    else {
                        // Indication that parameter should not be included in search criteria
                        selector.foreignBlockchain = undefined;
                    }

                    if (msg.payload.selector.tokenSymbol !== null) {
                        if (util.checkNonEmptyStr(msg.payload.selector.tokenSymbol)) {
                            selector.tokenSymbol = msg.payload.selector.tokenSymbol;
                        }
                    }
                    else {
                        // Indication that parameter should not be included in search criteria
                        selector.tokenSymbol = undefined;
                    }

                    if (msg.payload.selector.status !== null) {
                        if (util.checkNonEmptyStr(msg.payload.selector.status)) {
                            selector.status = msg.payload.selector.status;
                        }
                    }
                    else {
                        // Indication that parameter should not be included in search criteria
                        selector.status = undefined;
                    }

                    if (util.checkNonEmpty(msg.payload.selector.negateStatus)) {
                        selector.negateStatus = !!msg.payload.selector.negateStatus;
                    }

                    if (msg.payload.selector.startDate !== null) {
                        if (util.checkNonEmptyStr(msg.payload.selector.startDate)) {
                            selector.startDate = msg.payload.selector.startDate;
                        }
                    }
                    else {
                        // Indication that parameter should not be included in search criteria
                        selector.startDate = undefined;
                    }

                    if (msg.payload.selector.endDate !== null) {
                        if (util.checkNonEmptyStr(msg.payload.selector.endDate)) {
                            selector.endDate = msg.payload.selector.endDate;
                        }
                    }
                    else {
                        // Indication that parameter should not be included in search criteria
                        selector.endDate = undefined;
                    }
                }

                if (util.checkNumber(msg.payload.limit)) {
                    limit = msg.payload.limit;
                }
                if (util.checkNumber(msg.payload.skip)) {
                    skip = msg.payload.skip;
                }
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.listExportedAssets(selector, limit, skip, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("list exported assets", listExportedAssets);

    RED.httpAdmin.post("/catenis.listexportedassets/:id", RED.auth.needsPermission("catenis.listexportedassets"), function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.listexportedassets/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
};
