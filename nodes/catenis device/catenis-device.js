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
        })
    }

    RED.nodes.registerType("catenis device", CatenisDevice);

    RED.httpAdmin.get("/catenis.notificationevents", RED.auth.needsPermission("catenis.notificationevents"), function(req, res) {
        if (node != null) {
            try {
                res.json(node.notificationEvents);
            } catch(err) {
                res.sendStatus(500);
                node.error(RED._("catenis.notificationevents.failed", { error: err.toString() }));
            }
        } else {
            res.sendStatus(406);
        }
    });
}
