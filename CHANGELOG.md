# Changelog

## [3.0.2] - 2020-07-08

### Fixes
- Fixed description of `signature` property of data returned from Retrieve Message Origin node.

## [3.0.1] - 2020-07-07

### Fixes
- Fixed issue that prevented the Retrieve Message Origin node's documentation from being displayed.

## [3.0.0] - 2020-07-06

### Breaking changes
- The global configuration setting `Device` has been replaced with the new global configuration setting `Connection`.
 This will required that all Catenis nodes currently in use be reconfigured in order to select the appropriate
 connection to be used with it.

### New features
- Added support for version 0.10 of the Catenis Enterprise API.

### Changes
- The default value of the 'version' field of the Catenis Device properties has changed to 0.9.

## [2.1.0] - 2020-01-25

### Changes
- The default value of the 'version' field of the Catenis Device properties has changed to 0.9.

### New features
- As a consequence for targeting version 0.9 of the Catenis Enterprise API, the new features introduced by that version
 are supported: log, send, read and retrieve container info of Catenis off-chain messages.

## [2.0.3] - 2019-12-18

### Fixes
- Fix issue when entering a single value in input field of Set Permission Rights node's config parameters used to set permission at device level.

## [2.0.2] - 2019-12-16

### Fixes
- Fix issue with processing input message for Retrieve Permission Rights node.

## [2.0.1] - 2019-11-16

### Fixes
- Remove spurious debugging code from nodes Issue Asset, Reissue Asset, and Transfer Asset that was hindering their
 functionality; those nodes were simply not doing anything.

## [2.0.0] - 2019-08-17

### Breaking changes
- The data output by the Read Message node has a different format.
- The List Messages node accept an input of a different format: the old properties should now be passed as properties of
 a top level object named `selector`.
- The old `countExceeded` property of the data output by nodes List Messages and Retrieve Asset Issuance History has
 been replaced with a new property named `hasMore`.

### New features
- Added support for version 0.8 of the Catenis Enterprise API.
- Added new Retrieve Message Progress node.
- Added options to send/receive compressed data when calling the Catenis API methods.

### Other changes
- The default value of the 'version' field of the Catenis Device properties has changed to 0.8.
- Inputs and outputs of nodes Log Message, Send Message, Read Message, List Messages and Retrieve Asset Issuance History
 have changed to comply with the changes introduced in the corresponding API methods by versions 0.7 and 0.8 of the
 Catenis Enterprise API. 
- Added CHANGELOG (this) file.