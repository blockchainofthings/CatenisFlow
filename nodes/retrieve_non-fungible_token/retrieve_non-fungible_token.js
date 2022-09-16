const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function RetrieveNonFungibleToken(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            // Get token ID from node's configuration
            let tokenId;
            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.tokenId.trim())) {
                tokenId = trimmedStr;
            }

            // Get optional parameters from node's configuration
            let options = {
                retrieveContents: config.retrieveContents,
                async: config.async
            };

            if (options.retrieveContents) {
                options.contentsOnly = config.contentsOnly;
                options.contentsEncoding = config.contentsEncoding;

                if (util.checkIntNumberStr(config.dataChunkSize)) {
                    options.dataChunkSize = parseInt(config.dataChunkSize);
                }
            }

            if (util.checkNonNullObject(msg.payload)) {
                // Get parameters from message payload, overriding them as appropriate
                if (util.checkNonBlankStr(msg.payload.tokenId)) {
                    tokenId = msg.payload.tokenId.trim();
                }

                if (util.checkNonEmptyStr(msg.payload.continuationToken)) {
                    options = {
                        continuationToken: msg.payload.continuationToken
                    };
                }
                else {
                    if (util.checkNonEmpty(msg.payload.retrieveContents)) {
                        options.retrieveContents = !!msg.payload.retrieveContents;
                    }

                    if (options.retrieveContents) {
                        if (util.checkNonEmpty(msg.payload.contentsOnly)) {
                            options.contentsOnly = !!msg.payload.contentsOnly;
                        }

                        if (util.checkNonEmptyStr(msg.payload.contentsEncoding)) {
                            options.contentsEncoding = msg.payload.contentsEncoding;
                        }

                        if (util.checkNumber(msg.payload.dataChunkSize)) {
                            options.dataChunkSize = msg.payload.dataChunkSize;
                        }
                        else if (msg.payload.dataChunkSize === null) {
                            // Indication that data chunk size should not be specified
                            delete options.dataChunkSize;
                        }
                    }
                    else {
                        // Contents not being retrieved. Make sure that other
                        //  related parameters are not specified
                        if ('contentsOnly' in options) {
                            delete options.contentsOnly;
                        }

                        if ('contentsEncoding' in options) {
                            delete options.contentsEncoding;
                        }

                        if ('dataChunkSize' in options) {
                            delete options.dataChunkSize;
                        }
                    }

                    if (util.checkNonEmpty(msg.payload.async)) {
                        options.async = !!msg.payload.async;
                    }
                }
            }

            if (tokenId === undefined) {
                return node.error('Missing required parameter \'tokenId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.retrieveNonFungibleToken(tokenId, options, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("retrieve non-fungible token", RetrieveNonFungibleToken);

    RED.httpAdmin.post("/catenis.retrievenftoken/:id", RED.auth.needsPermission("catenis.retrievenftoken"), function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.retrievenftoken/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
}

