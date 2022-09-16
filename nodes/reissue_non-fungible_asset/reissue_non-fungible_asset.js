const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function ReissueNonFungibleAssetNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get asset ID from node's configuration
            let assetId;
            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.assetId.trim())) {
                assetId = trimmedStr;
            }

            // Get asset issuance info from node's configuration
            let issuanceInfoOrContinuationToken = {
                encryptNFTContents: config.encryptNFTContents,
                async: config.async
            };

            if (util.checkNonEmptyStr(trimmedStr = config.holdingDeviceId.trim())) {
                issuanceInfoOrContinuationToken.holdingDevices = {
                    id: trimmedStr,
                    isProdUniqueId: config.isProdUniqueId
                }
            }

            let nonFungibleTokens;
            let isFinal;

            if (util.checkNonNullObject(msg.payload)) {
                // Get parameters from message payload, overriding them as appropriate
                if (util.checkNonBlankStr(msg.payload.assetId)) {
                    assetId = msg.payload.assetId.trim();
                }

                if (util.checkNonEmptyStr(msg.payload.continuationToken)) {
                    issuanceInfoOrContinuationToken = msg.payload.continuationToken;
                }
                else {
                    if (util.checkNonEmpty(msg.payload.encryptNFTContents)) {
                        issuanceInfoOrContinuationToken.encryptNFTContents = !!msg.payload.encryptNFTContents;
                    }

                    if (typeof msg.payload.holdingDevices === 'object') {
                        if (msg.payload.holdingDevices !== null) {
                            issuanceInfoOrContinuationToken.holdingDevices = msg.payload.holdingDevices;
                        }
                        else {
                            // Indication that holding devices should not be specified
                            issuanceInfoOrContinuationToken.holdingDevices = undefined;
                        }
                    }

                    if (util.checkNonEmpty(msg.payload.async)) {
                        issuanceInfoOrContinuationToken.async = !!msg.payload.async;
                    }
                }

                if (util.checkNonNullObject(msg.payload.nonFungibleTokens)) {
                    nonFungibleTokens = msg.payload.nonFungibleTokens;
                }

                if (util.checkNonEmpty(msg.payload.isFinal)) {
                    isFinal = !!msg.payload.isFinal;
                }
            }

            if (assetId === undefined) {
                return node.error('Missing required parameter \'assetId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.reissueNonFungibleAsset(assetId, issuanceInfoOrContinuationToken, nonFungibleTokens, isFinal, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("reissue non-fungible asset", ReissueNonFungibleAssetNode);
};
