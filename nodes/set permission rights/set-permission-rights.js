/*
* @Author: mahesh
* @Date:   2018-01-15 22:49:34
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var merge = require('merge');

module.exports = function(RED) {
    function SetPermissionNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            var payload = merge(true, config, msg.payload);
            var device = RED.nodes.getNode(payload.device);

            var event = payload.event;
            var sysRight = payload.sysRight;
            var allowCtnNodeIndices = payload.allowCtnNodeIndices || "";
            var denyCtnNodeIndices = payload.denyCtnNodeIndices || "";
            var noneCtnNodeIndices = payload.noneCtnNodeIndices || "";
            var allowClientIds = payload.allowClientIds || "";
            var denyClientIds = payload.denyClientIds || "";
            var noneClientIds = payload.noneClientIds || "";
            var allowDeviceIds = payload.allowDeviceIds || "";
            var denyDeviceIds = payload.denyDeviceIds || "";
            var noneDeviceIds = payload.noneDeviceIds || "";
            var allowProdIds = payload.allowProdIds || "";
            var denyProdIds = payload.denyProdIds || "";
            var noneProdIds = payload.noneProdIds || "";

            allowCtnNodeIndices = allowCtnNodeIndices.split(" ").join("");
            denyCtnNodeIndices = denyCtnNodeIndices.split(" ").join("");
            noneCtnNodeIndices = noneCtnNodeIndices.split(" ").join("");
            allowClientIds = allowClientIds.split(" ").join("");
            denyClientIds = denyClientIds.split(" ").join("");
            noneClientIds = noneClientIds.split(" ").join("");
            allowDeviceIds = allowDeviceIds.split(" ").join("");
            denyDeviceIds = denyDeviceIds.split(" ").join("");
            noneDeviceIds = noneDeviceIds.split(" ").join("");
            allowProdIds = allowProdIds.split(" ").join("");
            denyProdIds = denyProdIds.split(" ").join("");
            noneProdIds = noneProdIds.split(" ").join("");

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
            rights.device.allow = allowDeviceIds.map(function(id) {
                return {
                    id: id,
                    isProdUniqueId: false
                }
            });
            rights.device.deny = denyDeviceIds.map(function(id) {
                return {
                    id: id,
                    isProdUniqueId: false
                }
            });
            rights.device.none = denyDeviceIds.map(function(id) {
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
            rights.device.deny = rights.device.deny.concat(denyProdIds.map(function(id) {
                return {
                    id: id,
                    isProdUniqueId: true
                }
            }));
            rights.device.none = rights.device.none.concat(noneProdIds.map(function(id) {
                return {
                    id: id,
                    isProdUniqueId: true
                }
            }));

            var ctnApiClient = device.ctnApiClient;
            ctnApiClient.setPermissionRights(event, rights, responseHandler.bind(node, {}));
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

