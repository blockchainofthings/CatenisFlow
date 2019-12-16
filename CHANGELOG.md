# Changelog

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