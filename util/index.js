/*
* @Author: Mahesh J
* @Date:   2018-01-23 23:30:17
*/

exports.checkNonNullObject = function (obj) {
	return typeof obj == 'object' && obj !== null;
}
