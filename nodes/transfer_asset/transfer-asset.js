const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function TransferAssetNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get asset ID from node's configuration
            let assetId;
            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.assetId.trim())) {
                assetId = trimmedStr;
            }

            // Get receiving device from node's configuration
            const receivingDevice = {
                id: util.checkNonEmptyStr(trimmedStr = config.receivingDeviceId.trim()) ? trimmedStr : undefined,
                isProdUniqueId: config.isProdUniqueId
            };

            let amount;

            if (util.checkNumber(msg.payload)) {
                // Assume that payload contains the amount of asset to transfer
                amount = msg.payload;
            }
            else if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNumber(msg.payload.amount)) {
                    // Get amount of asset to transfer
                    amount = msg.payload.amount;
                }

                if (util.checkNonBlankStr(msg.payload.assetId)) {
                    assetId = msg.payload.assetId.trim();
                }

                if (util.checkNonNullObject(msg.payload.receivingDevice)) {
                    if (util.checkNonEmptyStr(msg.payload.receivingDevice.id)) {
                        receivingDevice.id = msg.payload.receivingDevice.id;
                    }

                    if (util.checkNonEmpty(msg.payload.receivingDevice.isProdUniqueId)) {
                        receivingDevice.isProdUniqueId = !!msg.payload.receivingDevice.isProdUniqueId;
                    }
                }
            }

            if (assetId === undefined) {
                return node.error('Missing required parameter \'assetId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.transferAsset(assetId, amount, receivingDevice, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("transfer asset", TransferAssetNode);
};
