/*
* @Author: mahesh
* @Date:   2017-12-25 20:48:46
*/

const CtnApiClient = require('catenis-api-client');

module.exports = function(RED) {
    function CatenisDevice(config) {
        RED.nodes.createNode(this, config);
        var options = {
        	host: config.host,
        	environment: config.environment,
        	secure: config.secure,
        	version: config.version
        }
        this.ctnApiClient = new CtnApiClient(config.deviceId, config.apiAccessSecret, options);
    }
    RED.nodes.registerType("catenis device", CatenisDevice);
}
