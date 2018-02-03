/*
* @Author: mahesh
* @Date:   2017-12-25 20:48:46
*/

const CtnApiClient = require('catenis-api-client');

var node;

module.exports = function(RED) {
    function CatenisDevice(config) {
        RED.nodes.createNode(this, config);
        node = this;
        node.notificationEvents = {};
        node.permissionEvents = {};
        var options = {
        	host: config.host,
        	environment: config.environment,
        	secure: config.secure,
        	version: config.version
        }
        this.ctnApiClient = new CtnApiClient(config.deviceId, config.apiAccessSecret, options);
        this.ctnApiClient.listNotificationEvents(function (err, data) {
            if (err) {
                node.error('Error retrieving notification events', {});
            } else {
                node.notificationEvents = data.data;
            }
        });
        this.ctnApiClient.listPermissionEvents(function (err, data) {
            if (err) {
                node.error('Error retrieving permission events', {});
            } else {
                node.permissionEvents = data.data;
            }
        });
    }

    RED.nodes.registerType("catenis device", CatenisDevice);

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
}
