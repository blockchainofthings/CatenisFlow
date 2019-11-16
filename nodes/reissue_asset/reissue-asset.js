
var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function ReissueAssetNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            // Get asset ID from node's configuration
            var assetId;
            var trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.assetId.trim())) {
                assetId = trimmedStr;
            }

            // Get holding device from node's configuration
            var holdingDevice = {
                id: util.checkNonEmptyStr(trimmedStr = config.holdingDeviceId.trim()) ? trimmedStr : undefined,
                isProdUniqueId: config.isProdUniqueId
            };

            var amount;

            if (util.checkNumber(msg.payload)) {
                // Assume that payload contains the amount of asset to issue
                amount = msg.payload;
            }
            else if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNumber(msg.payload.amount)) {
                    // Get amount of asset to issue
                    amount = msg.payload.amount;
                }

                if (util.checkNonBlankStr(msg.payload.assetId)) {
                    assetId = msg.payload.assetId.trim();
                }

                if (typeof msg.payload.holdingDevice === 'object') {
                    if (msg.payload.holdingDevice !== null) {
                        if (util.checkNonEmptyStr(msg.payload.holdingDevice.id)) {
                            holdingDevice.id = msg.payload.holdingDevice.id;
                        }

                        if (util.checkNonEmpty(msg.payload.holdingDevice.isProdUniqueId)) {
                            holdingDevice.isProdUniqueId = !!msg.payload.holdingDevice.isProdUniqueId;
                        }
                    }
                    else {
                        // Indication that holding device should not be specified
                        holdingDevice.id = undefined;
                    }
                }
            }

            if (assetId === undefined) {
                return node.error('Missing required parameter \'assetId\'', msg);
            }

            if (holdingDevice.id === undefined) {
                holdingDevice = undefined;
            }

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.reissueAsset(assetId, amount, holdingDevice, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("reissue asset", ReissueAssetNode);
};
