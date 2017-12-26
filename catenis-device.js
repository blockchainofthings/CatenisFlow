/*
* @Author: mahesh
* @Date:   2017-12-25 20:48:46
*/

const CtnApiClient = require('catenis-api-client');

module.exports = function(RED) {
    function CatenisDevice(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.deviceid = config.deviceid;
        this.apiaccesssecret = config.apiaccesssecret;
        this.ctnApiClient = new CtnApiClient(this.deviceid, this.apiaccesssecret, {
            environment: 'beta'
        });
    }
    RED.nodes.registerType("catenis device", CatenisDevice);
}
