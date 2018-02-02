/*
* @Author: Mahesh J
* @Date:   2018-01-23 23:30:17
*/

exports.checkNonNullObject = function (obj) {
        return typeof obj === 'object' && obj !== null;
};

exports.checkNonEmptyStr = function (str) {
        return typeof str === 'string' && str.length > 0;
};

exports.checkNonEmpty = function (val) {
    return val !== undefined && val !== null;
};
