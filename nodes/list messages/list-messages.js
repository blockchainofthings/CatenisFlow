/*
* @Author: Mahesh J
* @Date:   2018-01-02 23:01:37
*/

var responseHandler = require('../../util/catenis-api-response-handler.js');
var moment = require('moment');

function formatDate(value) {
    var mt = moment(value.trim());

    if (mt.isValid()) {
        return mt.utc().format('YYYYMMDDTHHmmss[Z]');
    }

    return undefined;
}

function checkDateField(ctrlId) {
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
        var device = RED.nodes.getNode(config.device);

        node.on('input', function(msg) {
            var ctnApiClient = device.ctnApiClient;
            ctnApiClient.listMessages({
                action: config.action,
	            direction: config.direction,
	            fromDeviceIds: config.fromDeviceIds,
	            toDeviceIds: config.toDeviceIds,
	            fromDeviceProdUniqueIds: config.fromDeviceProdUniqueIds,
	            toDeviceProdUniqueIds: config.toDeviceProdUniqueIds,
	            readState: config.readState,
	            startDate: formatDate(config.startDate),
	            endDate: formatDate(config.endDate),
            }, responseHandler.bind(node, msg));
        });
    }
    RED.nodes.registerType("list messages", ListMessagesNode);
}

