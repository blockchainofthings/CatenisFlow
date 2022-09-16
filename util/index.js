exports.checkNonNullObject = function (obj) {
    return typeof obj === 'object' && obj !== null;
};

exports.checkNonEmptyStr = function (str) {
    return typeof str === 'string' && str.length > 0;
};

exports.checkNonBlankStr = function (str) {
    return typeof str === 'string' && str.trim().length > 0;
};

exports.checkNonEmpty = function (val) {
    return val !== undefined && val !== null;
};

exports.checkNumber = function (val) {
    return typeof val === 'number';
};

exports.checkIntNumberStr = function (str) {
    return typeof str === 'string' && !isNaN(parseInt(str));
};
