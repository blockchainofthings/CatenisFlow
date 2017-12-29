/*
* @Author: mahesh
* @Date:   2017-12-23 22:02:03
*/

module.exports = function(RED) {
    function LogMessageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.device = RED.nodes.getNode(config.device);
        var ctnApiClient = this.device.ctnApiClient;

        node.on('input', function(msg) {
            ctnApiClient.logMessage(msg.payload, {
                encoding: config.encoding,
                encrypt: config.encrypt,
                storage: config.storage
            }, function (err, data) {
                if (err || data.status !== 'success') {
                    // Do error handling
                }
            else {
                // Success. Retrieve returned data
                msg.payload = data.data;
                node.send(msg);
            }
            });
        });
    }
    RED.nodes.registerType("log message", LogMessageNode);
}
