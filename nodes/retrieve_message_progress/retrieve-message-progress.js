const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function RetrieveMessageProgressNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            let messageId;

            if (util.checkNonBlankStr(msg.payload)) {
                messageId = msg.payload.trim();
            }
            else {
                return node.error('Missing required parameter \'messageId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.retrieveMessageProgress(messageId, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("retrieve message progress", RetrieveMessageProgressNode);
};
