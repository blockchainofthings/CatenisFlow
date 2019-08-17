/*
* @Author: mahesh
* @Date:   2017-12-25 20:48:46
*/

var CtnApiClient = require('catenis-api-client');
var util = require('../../util');

module.exports = function(RED) {
    var node;

    function CatenisDevice(config) {
        RED.nodes.createNode(this, config);
        node = this;
        node.notificationEvents = {};
        node.permissionEvents = {};
        var options = {
        	secure: config.secure
        };

        var trimmedStr;

        if (util.checkNonEmptyStr(trimmedStr = config.host.trim())) {
            options.host = trimmedStr;
        }

        if (util.checkNonEmptyStr(config.environment)) {
            options.environment = config.environment;
        }

        if (util.checkNonEmptyStr(trimmedStr = config.version.trim())) {
            options.version = trimmedStr;
        }

        // Make sure that Catenis device nodes that had been defined before this option was
        //  available (in a previous version of Catenis Flow) use its default setting (true)
        node._useCompression = 'useCompression' in config ? config.useCompression : true;
        options.useCompression = node._useCompression;

        if (util.checkIntNumberStr(config.compressThreshold)) {
            options.compressThreshold = parseInt(config.compressThreshold);
        }

        this.ctnApiClient = new CtnApiClient(config.deviceId, config.apiAccessSecret, options);
        this.ctnApiClient.listNotificationEvents(function (err, data) {
            if (err) {
                node.error('Error retrieving notification events', err);
            } else {
                node.notificationEvents = data;
            }
        });
        this.ctnApiClient.listPermissionEvents(function (err, data) {
            if (err) {
                node.error('Error retrieving permission events', err);
            } else {
                node.permissionEvents = data;
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

    // Used to retrieve current `use compression` setting
    RED.httpAdmin.get("/catenis.devConfUseCompression/:id", RED.auth.needsPermission("catenis.devConfUseCompression"), function(req, res) {
        var _node = RED.nodes.getNode(req.params.id);
        if (_node !== undefined) {
            try {
                res.json({useCompression: _node._useCompression});
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.devConfUseCompression request: " + err);
            }
        } else {
            res.sendStatus(406);
        }
    });
};
