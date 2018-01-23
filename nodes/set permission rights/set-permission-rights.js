/*
* @Author: mahesh
* @Date:   2018-01-15 22:49:34
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var util = require('../../util');

module.exports = function(RED) {
    function SetPermissionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            var payload = msg.payload || {};
            var device = RED.nodes.getNode(payload.device);

            var eventName = payload.eventName || config.eventName;
            var sysRight = config.sysRight;
            var allowCtnNodeIndices = (config.allowCtnNodeIndices || "").split(" ").join("");
            var denyCtnNodeIndices = (config.denyCtnNodeIndices || "").split(" ").join("");
            var noneCtnNodeIndices = (config.noneCtnNodeIndices || "").split(" ").join("");
            var allowClientIds = (config.allowClientIds || "").split(" ").join("");
            var denyClientIds = (config.denyClientIds || "").split(" ").join("");
            var noneClientIds = (config.noneClientIds || "").split(" ").join("");
            var allowDeviceIds = (config.allowDeviceIds || "").split(" ").join("");
            var denyDeviceIds = (config.denyDeviceIds || "").split(" ").join("");
            var noneDeviceIds = (config.noneDeviceIds || "").split(" ").join("");
            var allowProdIds = (config.allowProdIds || "").split(" ").join("");
            var denyProdIds = (config.denyProdIds || "").split(" ").join("");
            var noneProdIds = (config.noneProdIds || "").split(" ").join("");
            var allowDevices = [];
            var denyDevices = [];
            var noneDevices = [];

            if (util.checkNonNullObject(payload.rights)) {

                if (payload.rights.system) {
                    sysRight = payload.rights.system;
                }

                if (util.checkNonNullObject(payload.catenisNode)) {

                    if (payload.catenisNode.allow) {
                        allowCtnNodeIndices = payload.catenisNode.allow;
                    }

                    if (payload.catenisNode.deny) {
                        denyCtnNodeIndices = payload.catenisNode.deny;
                    }

                    if (payload.catenisNode.none) {
                        noneCtnNodeIndices = payload.catenisNode.none;
                    }
                }

                if (util.checkNonNullObject(payload.client)) {

                    if (payload.client.allow) {
                        allowClientIds = payload.client.allow;
                    }

                    if (payload.client.deny) {
                        denyClientIds = payload.client.deny;
                    }

                    if (payload.client.none) {
                        noneClientIds = payload.client.none;
                    }
                }

                if (util.checkNonNullObject(payload.device)) {

                    if (payload.device.allow) {
                        allowDevices = payload.device.allow;
                    }

                    if (payload.device.deny) {
                        allowDevices = payload.device.deny;
                    }

                    if (payload.device.none) {
                        allowDevices = payload.device.none;
                    }
                }
            }

            allowCtnNodeIndices = (allowCtnNodeIndices === "") ? [] : allowCtnNodeIndices.split(",");
            denyCtnNodeIndices = (denyCtnNodeIndices === "") ? [] : denyCtnNodeIndices.split(",");
            noneCtnNodeIndices = (noneCtnNodeIndices === "") ? [] : noneCtnNodeIndices.split(",");
            allowClientIds = (allowClientIds === "") ? [] : allowClientIds.split(",");
            denyClientIds = (denyClientIds === "") ? [] : denyClientIds.split(",");
            noneClientIds = (noneClientIds === "") ? [] : noneClientIds.split(",");
            allowDeviceIds = (allowDeviceIds === "") ? [] : allowDeviceIds.split(",");
            denyDeviceIds = (denyDeviceIds === "") ? [] : denyDeviceIds.split(",");
            noneDeviceIds = (noneDeviceIds === "") ? [] : noneDeviceIds.split(",");
            allowProdIds = (allowProdIds === "") ? [] : allowProdIds.split(",");
            denyProdIds = (denyProdIds === "") ? [] : denyProdIds.split(",");
            noneProdIds = (noneProdIds === "") ? [] : noneProdIds.split(",");

            var rights = {
                catenisNode: {},
                client: {},
                device: {}
            };

            if (sysRight) {
                rights.system = sysRight;
            }

            rights.catenisNode.allow = allowCtnNodeIndices;
            rights.catenisNode.deny = denyCtnNodeIndices;
            rights.catenisNode.none = noneCtnNodeIndices;
            rights.client.allow = allowClientIds;
            rights.client.deny = denyClientIds;
            rights.client.none = noneClientIds;

            if (allowDevices && allowDevices.length > 0) {
                rights.device.allow = allowDevices;
            } else {
                rights.device.allow = allowDeviceIds.map(function(id) {
                    return {
                        id: id,
                        isProdUniqueId: false
                    }
                });
                rights.device.allow = rights.device.allow.concat(allowProdIds.map(function(id) {
                    return {
                        id: id,
                        isProdUniqueId: true
                    }
                }));
            }

            if (denyDevices && denyDevices.length > 0) {
                rights.device.deny = denyDevices;
            } else {
                rights.device.deny = denyDeviceIds.map(function(id) {
                    return {
                        id: id,
                        isProdUniqueId: false
                    }
                });
                rights.device.deny = rights.device.deny.concat(denyProdIds.map(function(id) {
                    return {
                        id: id,
                        isProdUniqueId: true
                    }
                }));
            }

            if (noneDevices && noneDevices.length > 0) {
                rights.device.none = noneDevices;
            } else {
                rights.device.none = denyDeviceIds.map(function(id) {
                    return {
                        id: id,
                        isProdUniqueId: false
                    }
                });
                rights.device.none = rights.device.none.concat(noneProdIds.map(function(id) {
                    return {
                        id: id,
                        isProdUniqueId: true
                    }
                }));
            }

            var ctnApiClient = device.ctnApiClient;
            ctnApiClient.setPermissionRights(eventName, rights, responseHandler.bind(node, {}));
        });
    }

    RED.nodes.registerType("set permission rights", SetPermissionNode);

    RED.httpAdmin.post("/catenis.setpermissionrights/:id", RED.auth.needsPermission("catenis.setpermissionrights"), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Could not set permission rights");
            }
        } else {
            res.sendStatus(404);
        }
    });
}

