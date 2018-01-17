/*
* @Author: Mahesh J
* @Date:   2018-01-02 23:01:37
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var moment = require('moment');
var merge = require('merge');

function formatDate(value) {
    var mt = moment(value.trim());
    if (mt.isValid()) {
        return mt.utc().format('YYYYMMDDTHHmmss[Z]');
    }
    return undefined;
}

function checkDateField(ctrlId, node) {
    var startDate = document.getElementById(ctrlId);

    if (startDate && checkUndefined(startDate.value.trim())) {
        if (!moment(startDate.value.trim()).isValid()) {
            alert('Invalid date and time. Please enter date and time in a ISO-8601 format like \'YYYY-MM-DD HH:mm:ss\'');
            startDate.focus();
            return false;
        }
    }

    return true;
}

function checkListMessagesDateFields() {
    if (checkDateField('idtStartDate')) {
        return checkDateField('idtEndDate');
    }
    return false;
}

module.exports = function(RED) {
    function ListMessagesNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
            var payload = merge(true, config, msg.payload);
            var device = RED.nodes.getNode(payload.device);

            var ctnApiClient = device.ctnApiClient;
            payload.startDate = formatDate(payload.startDate);
            payload.endDate = formatDate(payload.endDate);
            ctnApiClient.listMessages(payload, responseHandler.bind(node, msg));
        });
    }

    RED.nodes.registerType("list messages", ListMessagesNode);

    RED.httpAdmin.post("/catenis.listmessages/:id", RED.auth.needsPermission("catenis.listmessages"), function(req, res) {
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

