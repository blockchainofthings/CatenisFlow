
var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');
// DEBUG - Begin
var nsUtil = require('util');
// DEBUG - End

module.exports = function(RED) {
    function IssueAssetNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            // Get asset info from node's configuration
            var assetInfo = {
                name: config.assetName.trim(),
                canReissue: config.canReissue
            };

            if (util.checkIntNumberStr(config.decimalPlaces)) {
                assetInfo.decimalPlaces = parseInt(config.decimalPlaces);
            }

            var trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.assetDescription.trim())) {
                assetInfo.description = trimmedStr;
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

                if (util.checkNonNullObject(msg.payload.assetInfo)) {
                    // Payload has asset info. Override parameters as appropriate
                    if (util.checkNonEmptyStr(msg.payload.assetInfo.name)) {
                        assetInfo.name = msg.payload.assetInfo.name;
                    }

                    if (msg.payload.assetInfo.description !== null) {
                        if (util.checkNonEmptyStr(msg.payload.assetInfo.description)) {
                            assetInfo.description = msg.payload.assetInfo.description;
                        }
                    }
                    else {
                        // Indication that asset description should not be specified
                        if ('description' in assetInfo) {
                            assetInfo.description = undefined;
                        }
                    }

                    if (util.checkNonEmpty(msg.payload.assetInfo.canReissue)) {
                        assetInfo.canReissue = !!msg.payload.assetInfo.canReissue;
                    }

                    if (util.checkNumber(msg.payload.assetInfo.decimalPlaces)) {
                        assetInfo.decimalPlaces = msg.payload.assetInfo.decimalPlaces;
                    }
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

            if (holdingDevice.id === undefined) {
                holdingDevice = undefined;
            }

            // DEBUG - Begin
            node.log('>>>>>> Issue Asset: assetInfo: ' + nsUtil.inspect(assetInfo));
            node.log('>>>>>> Issue Asset: amount: ' + amount);
            node.log('>>>>>> Issue Asset: holdingDevice: ' + nsUtil.inspect(holdingDevice));
            return;
            // DEBUG - End

            var device = RED.nodes.getNode(config.device);
            var ctnApiClient = device.ctnApiClient;

            ctnApiClient.issueAsset(assetInfo, amount, holdingDevice, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("issue asset", IssueAssetNode);
};
