const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function migrateAssetNode(config) {
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

            // Get migration data from node's configuration
            let migration = {};

            if (util.checkNonEmptyStr(trimmedStr = config.direction.trim())) {
                migration.direction = trimmedStr;
            }

            if (util.checkNonEmptyStr(trimmedStr = config.destAddress.trim())) {
                migration.destAddress = trimmedStr;
            }

            // Get options from node's configuration
            const options = {
                estimateOnly: config.estimateOnly
            };

            if (util.checkNonEmptyStr(trimmedStr = config.consumptionProfile.trim())) {
                options.consumptionProfile = trimmedStr;
            }

            if (util.checkNumber(msg.payload)) {
                // Assume that payload contains the amount of asset to be migrated
                migration.amount = msg.payload;
            }
            else if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonBlankStr(msg.payload.assetId)) {
                    // Assume that payload contains the asset ID
                    assetId = msg.payload.assetId.trim();
                }

                if (util.checkNonBlankStr(msg.payload.foreignBlockchain)) {
                    // Assume that payload contains the foreign blockchain
                    foreignBlockchain = msg.payload.foreignBlockchain.trim();
                }

                if (util.checkNonBlankStr(msg.payload.migration)) {
                    // Assume that property contains the ID of the migration to reprocess
                    migration = msg.payload.migration.trim();
                }
                else if (util.checkNonNullObject(msg.payload.migration)) {
                    // Payload has migration properties. Override parameters as appropriate
                    if (util.checkNonEmptyStr(msg.payload.migration.direction)) {
                        migration.direction = msg.payload.migration.direction;
                    }

                    if (util.checkNumber(msg.payload.migration.amount)) {
                        migration.amount = msg.payload.migration.amount;
                    }

                    if (msg.payload.migration.destAddress !== null) {
                        if (util.checkNonEmptyStr(msg.payload.migration.destAddress)) {
                            migration.destAddress = msg.payload.migration.destAddress;
                        }
                    }
                    else {
                        // Indication that destination address should not be specified
                        migration.destAddress = undefined;
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

            ctnApiClient.migrateAsset(assetId, foreignBlockchain, migration, options, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("migrate asset", migrateAssetNode);
};
