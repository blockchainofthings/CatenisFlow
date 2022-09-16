const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function TransferNFToken(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            let trimmedStr;

            // Get receiving device from node's configuration
            let receivingDevice = {
                id: util.checkNonEmptyStr(trimmedStr = config.receivingDeviceId.trim()) ? trimmedStr : undefined,
                isProdUniqueId: config.isProdUniqueId
            };

            // Get async setting from node's configuration
            let asyncProc = config.async;

            let tokenId;

            if (util.checkNonBlankStr(msg.payload)) {
                tokenId = msg.payload.trim();
            }
            else if (util.checkNonNullObject(msg.payload)) {
                // Get parameters from message payload, overriding them as appropriate
                if (util.checkNonBlankStr(msg.payload.tokenId)) {
                    tokenId = msg.payload.tokenId.trim();
                }

                if (util.checkNonNullObject(msg.payload.receivingDevice)) {
                    if (util.checkNonEmptyStr(msg.payload.receivingDevice.id)) {
                        receivingDevice.id = msg.payload.receivingDevice.id;
                    }

                    if (util.checkNonEmpty(msg.payload.receivingDevice.isProdUniqueId)) {
                        receivingDevice.isProdUniqueId = !!msg.payload.receivingDevice.isProdUniqueId;
                    }
                }

                if (util.checkNonEmpty(msg.payload.async)) {
                    asyncProc = !!msg.payload.async;
                }
            }

            if (tokenId === undefined) {
                return node.error('Missing required parameter \'tokenId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.transferNonFungibleToken(tokenId, receivingDevice, asyncProc, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("transfer non-fungible token", TransferNFToken);
};
