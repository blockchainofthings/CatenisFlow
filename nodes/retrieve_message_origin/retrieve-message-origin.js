const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function retrieveMessageOrigin(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            let messageId,
                msgToSign;
            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.messageId.trim())) {
                messageId = trimmedStr;
            }

            if (util.checkNonEmptyStr(trimmedStr = config.msgToSign.trim())) {
                msgToSign = trimmedStr;
            }

            if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonBlankStr(msg.payload.messageId)) {
                    messageId = msg.payload.messageId.trim();
                }
                if (util.checkNonBlankStr(msg.payload.msgToSign)) {
                    msgToSign = msg.payload.msgToSign.trim();
                }
            }

            if (messageId === undefined) {
                return node.error('Missing required parameter \'messageId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.retrieveMessageOrigin(messageId, msgToSign, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("retrieve message origin", retrieveMessageOrigin);

    RED.httpAdmin.post("/catenis.retrievemsgorigin/:id", RED.auth.needsPermission("catenis.retrievemsgorigin"), function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.retrievemsgorigin/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
}
