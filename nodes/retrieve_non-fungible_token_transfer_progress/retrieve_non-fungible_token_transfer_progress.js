const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function RetrieveNFTokenTransferProgressNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            let tokenId;
            let transferId;

            if (util.checkNonNullObject(msg.payload)) {
                // Get parameters from message payload
                if (util.checkNonBlankStr(msg.payload.tokenId)) {
                    tokenId = msg.payload.tokenId.trim();
                }

                if (util.checkNonBlankStr(msg.payload.transferId)) {
                    transferId = msg.payload.transferId.trim();
                }
            }

            if (tokenId === undefined) {
                return node.error('Missing required parameter \'tokenId\'', msg);
            }

            if (transferId === undefined) {
                return node.error('Missing required parameter \'transferId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.retrieveNonFungibleTokenTransferProgress(tokenId, transferId, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("retrieve non-fungible token transfer progress", RetrieveNFTokenTransferProgressNode);
};
