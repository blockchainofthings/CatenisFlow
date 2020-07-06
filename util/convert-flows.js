/**
 * Created by claudio on 2020-07-06
 */

const fs = require('fs');

/**
 * Helper function used to convert Node-RED flows created for Catenis Flow prior to
 *  version 3.0 so they can be used with Catenis Flow version 3.0
 * @param path Path to Node-RED flows JSON file (located at ~/.node-red/)
 */
function convertToCatenisFlow3(path) {
    try {
        let flows = JSON.parse(fs.readFileSync(path, {encoding: 'utf8'}));

        flows = flows.map(flow => {
            if (flow.type === 'catenis device') {
                flow.type = 'catenis api connection';
            }

            return flow;
        });

        fs.renameSync(path, path.replace('.json', '.old.json'));
        fs.writeFileSync(path, JSON.stringify(flows));
    }
    catch (err) {
        console.error('Error converting Node-RED flows to work with Catenis Flow 3.0:', err);
    }
}

exports.convertToCatenisFlow3 = convertToCatenisFlow3;
