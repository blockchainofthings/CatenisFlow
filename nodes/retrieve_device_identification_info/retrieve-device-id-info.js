const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function retrieveDeviceInfoNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            let deviceId;
            let trimmedStr;

            if (util.checkNonEmptyStr(trimmedStr = config.deviceId.trim())) {
                deviceId = trimmedStr;
            }

            let isProdUniqueId = config.isProdUniqueId;

            if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonBlankStr(msg.payload.deviceId)) {
                    deviceId = msg.payload.deviceId.trim();
                }
                if (util.checkNonEmpty(msg.payload.isProdUniqueId)) {
                    isProdUniqueId = !!msg.payload.isProdUniqueId;
                }
            }

            if (deviceId === undefined) {
                return node.error('Missing required parameter \'deviceId\'', msg);
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.retrieveDeviceIdentificationInfo(deviceId, isProdUniqueId, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("retrieve device identification info", retrieveDeviceInfoNode);

    RED.httpAdmin.post("/catenis.retrievedeviceidinfo/:id", RED.auth.needsPermission("catenis.retrievedeviceidinfo"), function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.retrievedeviceidinfo/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
}
