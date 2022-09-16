const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function IssueNonFungibleAssetNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get asset issuance info from node's configuration
            let issuanceInfoOrContinuationToken = {
                assetInfo: {
                    name: config.assetName.trim(),
                    canReissue: config.canReissue
                },
                encryptNFTContents: config.encryptNFTContents,
                async: config.async
            };

            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.assetDescription.trim())) {
                issuanceInfoOrContinuationToken.assetInfo.description = trimmedStr;
            }

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
                if (util.checkNonEmptyStr(msg.payload.continuationToken)) {
                    issuanceInfoOrContinuationToken = msg.payload.continuationToken;
                }
                else {
                    if (util.checkNonNullObject(msg.payload.assetInfo)) {
                        if (util.checkNonEmptyStr(msg.payload.assetInfo.name)) {
                            issuanceInfoOrContinuationToken.assetInfo.name = msg.payload.assetInfo.name;
                        }

                        if (msg.payload.assetInfo.description !== null) {
                            if (util.checkNonEmptyStr(msg.payload.assetInfo.description)) {
                                issuanceInfoOrContinuationToken.assetInfo.description = msg.payload.assetInfo.description;
                            }
                        }
                        else {
                            // Indication that asset description should not be specified
                            if ('description' in issuanceInfoOrContinuationToken.assetInfo) {
                                issuanceInfoOrContinuationToken.assetInfo.description = undefined;
                            }
                        }

                        if (util.checkNonEmpty(msg.payload.assetInfo.canReissue)) {
                            issuanceInfoOrContinuationToken.assetInfo.canReissue = !!msg.payload.assetInfo.canReissue;
                        }
                    }

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

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.issueNonFungibleAsset(issuanceInfoOrContinuationToken, nonFungibleTokens, isFinal, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("issue non-fungible asset", IssueNonFungibleAssetNode);
};
