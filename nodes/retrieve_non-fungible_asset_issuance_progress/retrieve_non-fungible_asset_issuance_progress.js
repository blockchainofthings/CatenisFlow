const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function RetrieveNFAssetIssuanceProgressNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get the asset issuance ID from message payload
            let issuanceId;

            if (util.checkNonBlankStr(msg.payload)) {
                issuanceId = msg.payload.trim();
            }
            else {
                return node.error('Missing required parameter \'issuanceId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.retrieveNonFungibleAssetIssuanceProgress(issuanceId, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("retrieve non-fungible asset issuance progress", RetrieveNFAssetIssuanceProgressNode);
};
