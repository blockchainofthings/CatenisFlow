const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function exportAssetNode(config) {
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

            // Get options from node's configuration
            const options = {
                estimateOnly: config.estimateOnly
            };

            if (util.checkNonEmptyStr(trimmedStr = config.consumptionProfile.trim())) {
                options.consumptionProfile = trimmedStr;
            }

            const token = {};

            if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonBlankStr(msg.payload.assetId)) {
                    // Assume that payload contains the asset ID
                    assetId = msg.payload.assetId.trim();
                }

                if (util.checkNonBlankStr(msg.payload.foreignBlockchain)) {
                    // Assume that payload contains the foreign blockchain
                    foreignBlockchain = msg.payload.foreignBlockchain.trim();
                }

                if (util.checkNonNullObject(msg.payload.token)) {
                    // Payload has token properties
                    if (util.checkNonEmptyStr(msg.payload.token.name)) {
                        token.name = msg.payload.token.name;
                    }

                    if (util.checkNonEmptyStr(msg.payload.token.symbol)) {
                        token.symbol = msg.payload.token.symbol;
                    }
                }

                if (util.checkNonNullObject(msg.payload.options)) {
                    // Payload has options. Override parameters as appropriate
                    if (msg.payload.options.consumptionProfile !== null) {
                        if (util.checkNonEmptyStr(msg.payload.options.consumptionProfile)) {
                            options.consumptionProfile = msg.payload.options.consumptionProfile;
                        }
                    }
                    else {
                        // Indication that default consumption profile should be used
                        options.consumptionProfile = undefined;
                    }

                    if (util.checkNonEmpty(msg.payload.options.estimateOnly)) {
                        options.estimateOnly = !!msg.payload.options.estimateOnly;
                    }
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

            ctnApiClient.exportAsset(assetId, foreignBlockchain, token, options, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("export asset", exportAssetNode);
};
