const responseHandler = require('../../util/catenis-api-response-handler.js');
const util = require('../../util');

module.exports = function(RED) {
    function SetPermissionNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            function parseCSList(list) {
                if (typeof list === 'string' && list.length > 0) {
                    const elems = list.trim().split(/\s*,\s*/);

                    if (elems.length > 1) {
                        return elems;
                    }
                    else if (elems[0] !== '') {
                        return elems[0];
                    }
                }
            }

            let trimmedStr;
            let eventName = util.checkNonEmptyStr(trimmedStr = config.eventName.trim()) ? trimmedStr : undefined;
            const rights = {};
            const ctnNodeRights = {};
            const clientRights = {};
            const deviceRights = {};

            if (util.checkNonEmptyStr(config.sysRight)) {
                rights.system = config.sysRight;
            }

            let ids;

            if ((ids = parseCSList(config.allowCtnNodeIndices)) !== undefined) {
                ctnNodeRights.allow = ids;
            }
            if ((ids = parseCSList(config.denyCtnNodeIndices)) !== undefined) {
                ctnNodeRights.deny = ids;
            }
            if ((ids = parseCSList(config.noneCtnNodeIndices)) !== undefined) {
                ctnNodeRights.none = ids;
            }

            if ((ids = parseCSList(config.allowClientIds)) !== undefined) {
                clientRights.allow = ids;
            }
            if ((ids = parseCSList(config.denyClientIds)) !== undefined) {
                clientRights.deny = ids;
            }
            if ((ids = parseCSList(config.noneClientIds)) !== undefined) {
                clientRights.none = ids;
            }

            if ((ids = parseCSList(config.allowDeviceIds)) !== undefined) {
                deviceRights.allow = Array.isArray(ids) ? ids.map(function (id) {
                    return {
                        id: id
                    }
                }) : {id: ids};
            }
            if ((ids = parseCSList(config.denyDeviceIds)) !== undefined) {
                deviceRights.deny = Array.isArray(ids) ? ids.map(function (id) {
                    return {
                        id: id
                    }
                }) : {id: ids};
            }
            if ((ids = parseCSList(config.noneDeviceIds)) !== undefined) {
                deviceRights.none = Array.isArray(ids) ? ids.map(function (id) {
                    return {
                        id: id
                    }
                }) : {id: ids};
            }

            if ((ids = parseCSList(config.allowProdIds)) !== undefined) {
                deviceRights.allow = Array.isArray(ids) ? ids.map(function (id) {
                    return {
                        id: id,
                        isProdUniqueId: true
                    }
                }) : {id: ids, isProdUniqueId: true};
            }
            if ((ids = parseCSList(config.denyProdIds)) !== undefined) {
                deviceRights.deny = Array.isArray(ids) ? ids.map(function (id) {
                    return {
                        id: id,
                        isProdUniqueId: true
                    }
                }) : {id: ids, isProdUniqueId: true};
            }
            if ((ids = parseCSList(config.noneProdIds)) !== undefined) {
                deviceRights.none = Array.isArray(ids) ? ids.map(function (id) {
                    return {
                        id: id,
                        isProdUniqueId: true
                    }
                }) : {id: ids, isProdUniqueId: true};
            }

            if (util.checkNonNullObject(msg.payload)) {
                if (util.checkNonBlankStr(msg.payload.eventName)) {
                    eventName = msg.payload.eventName.trim();
                }

                if (util.checkNonNullObject(msg.payload.rights)) {
                    if (util.checkNonEmptyStr(msg.payload.rights.system)) {
                        rights.system = msg.payload.rights.system;
                    }

                    if (util.checkNonNullObject(msg.payload.rights.catenisNode)) {
                        if (Array.isArray(msg.payload.rights.catenisNode.allow) || util.checkNonEmptyStr(msg.payload.rights.catenisNode.allow)) {
                            ctnNodeRights.allow = msg.payload.rights.catenisNode.allow;
                        }
                        if (Array.isArray(msg.payload.rights.catenisNode.deny) || util.checkNonEmptyStr(msg.payload.rights.catenisNode.deny)) {
                            ctnNodeRights.deny = msg.payload.rights.catenisNode.deny;
                        }
                        if (Array.isArray(msg.payload.rights.catenisNode.none) || util.checkNonEmptyStr(msg.payload.rights.catenisNode.none)) {
                            ctnNodeRights.none = msg.payload.rights.catenisNode.none;
                        }
                    }

                    if (util.checkNonNullObject(msg.payload.rights.client)) {
                        if (Array.isArray(msg.payload.rights.client.allow) || util.checkNonEmptyStr(msg.payload.rights.client.allow)) {
                            clientRights.allow = msg.payload.rights.client.allow;
                        }
                        if (Array.isArray(msg.payload.rights.client.deny) || util.checkNonEmptyStr(msg.payload.rights.client.deny)) {
                            clientRights.deny = msg.payload.rights.client.deny;
                        }
                        if (Array.isArray(msg.payload.rights.client.none) || util.checkNonEmptyStr(msg.payload.rights.client.none)) {
                            clientRights.none = msg.payload.rights.client.none;
                        }
                    }

                    if (util.checkNonNullObject(msg.payload.rights.device)) {
                        if (Array.isArray(msg.payload.rights.device.allow) || util.checkNonNullObject(msg.payload.rights.device.allow)) {
                            deviceRights.allow = msg.payload.rights.device.allow;
                        }
                        if (Array.isArray(msg.payload.rights.device.deny) || util.checkNonNullObject(msg.payload.rights.device.deny)) {
                            deviceRights.deny = msg.payload.rights.device.deny;
                        }
                        if (Array.isArray(msg.payload.rights.device.none) || util.checkNonNullObject(msg.payload.rights.device.none)) {
                            deviceRights.none = msg.payload.rights.device.none;
                        }
                    }
                }
            }

            if (eventName === undefined) {
                return node.error('Missing required parameter \'eventName\'', msg);
            }

            if (Object.keys(ctnNodeRights).length > 0) {
                rights.catenisNode = ctnNodeRights;
            }
            if (Object.keys(clientRights).length > 0) {
                rights.client = clientRights;
            }
            if (Object.keys(deviceRights).length > 0) {
                rights.device = deviceRights;
            }

            const connection = RED.nodes.getNode(config.connection);
            const ctnApiClient = connection.ctnApiClient;

            ctnApiClient.setPermissionRights(eventName, rights, responseHandler.bind(node, {}));
        });
    }

    RED.nodes.registerType("set permission rights", SetPermissionNode);

    RED.httpAdmin.post("/catenis.setpermissionrights/:id", RED.auth.needsPermission("catenis.setpermissionrights"), function(req, res) {
        const node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                node.receive();
                res.sendStatus(200);
            } catch(err) {
                res.sendStatus(500);
                node.error("Error sending message to node component in response to catenis.setpermissionrights/:id request: " + err);
            }
        } else {
            res.sendStatus(404);
        }
    });
}

