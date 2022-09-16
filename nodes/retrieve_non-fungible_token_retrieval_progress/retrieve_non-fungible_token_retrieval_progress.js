const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function RetrieveNFTokenRetrievalProgressNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get token ID from node's configuration
            let tokenId;
            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.tokenId.trim())) {
                tokenId = trimmedStr;
            }

            // Get toke retrieval ID from message payload
            let retrievalId;

            if (util.checkNonBlankStr(msg.payload)) {
                retrievalId = msg.payload.trim();
            }
            else if (util.checkNonNullObject(msg.payload)) {
                // Get parameters from message payload, overriding them as appropriate
                if (util.checkNonBlankStr(msg.payload.tokenId)) {
                    tokenId = msg.payload.tokenId.trim();
                }

                if (util.checkNonBlankStr(msg.payload.retrievalId)) {
                    retrievalId = msg.payload.retrievalId.trim();
                }
            }

            if (tokenId === undefined) {
                return node.error('Missing required parameter \'tokenId\'', msg);
            }

            if (retrievalId === undefined) {
                return node.error('Missing required parameter \'retrievalId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.retrieveNonFungibleTokenRetrievalProgress(tokenId, retrievalId, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("retrieve non-fungible token retrieval progress", RetrieveNFTokenRetrievalProgressNode);
};
