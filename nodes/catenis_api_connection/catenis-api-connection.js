const CtnApiClient = require('catenis-api-client');
const util = require('../../util');

module.exports = function(RED) {
    let node;

    function CatenisApiConnection(config) {
        RED.nodes.createNode(this, config);
        node = this;
        node.notificationEvents = {};
        node.permissionEvents = {};
        const options = {
            secure: config.secure,
            useCompression: config.useCompression
        };

        let trimmedStr;

        if (util.checkNonEmptyStr(trimmedStr = config.host.trim())) {
            options.host = trimmedStr;
        }

        if (util.checkNonEmptyStr(config.environment)) {
            options.environment = config.environment;
        }

        if (util.checkNonEmptyStr(trimmedStr = config.version.trim())) {
            options.version = trimmedStr;
        }

        if (util.checkIntNumberStr(config.compressThreshold)) {
            options.compressThreshold = parseInt(config.compressThreshold);
        }

        const deviceId = util.checkNonEmptyStr(trimmedStr = config.deviceId.trim()) ?
            trimmedStr : undefined;
        const apiAccessSecret = util.checkNonEmptyStr(trimmedStr = config.apiAccessSecret.trim()) ?
            trimmedStr : undefined;

        node.ctnApiClient = new CtnApiClient(deviceId, apiAccessSecret, options);

        if (deviceId !== undefined) {
            node.ctnApiClient.listNotificationEvents(function (err, data) {
                if (err) {
                    node.error('Error retrieving notification events', err);
                }
                else {
                    node.notificationEvents = data;
                }
            });
            node.ctnApiClient.listPermissionEvents(function (err, data) {
                if (err) {
                    node.error('Error retrieving permission events', err);
                }
                else {
                    node.permissionEvents = data;
                }
            });
        }
    }

    RED.nodes.registerType("catenis api connection", CatenisApiConnection);

    RED.httpAdmin.get("/catenis.notificationevents", RED.auth.needsPermission("catenis.notificationevents"), function(req, res) {
        if (node != null) {
            try {
                res.json(node.notificationEvents);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error responding to catenis.notificationevents request: " + err);
            }
        } else {
            res.sendStatus(406);
        }
    });

    RED.httpAdmin.get("/catenis.permissionevents", RED.auth.needsPermission("catenis.permissionevents"), function(req, res) {
        if (node != null) {
            try {
                res.json(node.permissionEvents);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error responding to catenis.permissionevents request: " + err);
            }
        } else {
            res.sendStatus(406);
        }
    });
};
