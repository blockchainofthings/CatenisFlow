# node-red-contrib-catenis

A set of Node-RED nodes to build IOT flows using Catenis Enterprise API. Please visit our website [blockchainofthings.com](https://www.blockchainofthings.com/) for more details.

# Installation

Run the following npm command in your Node-RED user directory (typically ~/.node-red):

	npm install node-red-contrib-catenis

# Usage

Once you install the package and restart Node-RED, you'll see a new set of nodes in the sidebar under the category `Catenis`.

## Prerequisites

Each node requires a `Catenis device` to be configured. Once you have the device details, you can place any of the nodes in the flow editor and configure a new device as shown below with the `log message` node as an example.

![Example node configuration UI for log message node](/images/device-config.png)

## Creating flows

Each node corresponds to one Catenis API method. You can find the documentation for all methods here - [Catenis Enterprise API Docs](http://catenis.com/api/docs).

There are two modes in which the nodes can operate.

1. Interactive mode
2. Non-interactive mode

### Interactive mode

Nodes that support this mode will have an button on the input side of the node. Clcking on it will trigger the flow. `List messages` node is one such example.

### Non-interactive mode

All nodes support non-interactive mode. You can place the node in any flow and they will be triggered whenever data is passed to them via their input port.

Extensive documentation for each node is provided (click on a node to see it) with respect to supported modes, input payload and expected output, along with how to use them in your flows.

