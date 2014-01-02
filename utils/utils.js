/*
 var dateFormat = require('dateformat');

 exports.dateToString = function(date) {
 date = date || new Date();
 return dateFormat(date, "yyyy-mm-dd");
 };

 exports.dateToHumanString = function(date) {
 date = date || new Date();
 return dateFormat(date, "dddd, dS mmmm yyyy");
 };
 */

exports.objectToJsonString = function (obj) {
	return JSON.stringify(obj, null, 4);
};

exports.nl2br = function (str) {
	return str.replace(/\n/g, '<br />');
};

exports.round1 = function (n) {
	return Math.round(n * 10) / 10;
};
exports.round2 = function (n) {
	return Math.round(n * 100) / 100;
};
exports.round3 = function (n) {
	return Math.round(n * 1000) / 1000;
};

exports.capitaliseFirstLetter = function (str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.createArray = function (length, fill) {
	var a, i;

	a = new Array(length);
	for (i = 0; i < length; ++i) {
		if (typeof fill == 'function') {
			a[i] = fill();
		} else {
			a[i] = fill;
		}
	}
	return a;
};

exports.arrayHas = function (arr, obj) {
	return (arr.indexOf(obj) != -1);
};

exports.stupidDeepClone = function (obj) {
	return JSON.parse(JSON.stringify(obj));
};

/**
 * @param obj
 * @param fn (item, key)
 * @return obj
 * */
exports.objForEach = function (obj, fn) {
	if (obj && fn) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				fn(obj[key], key, obj);
			}
		}
	}
	return obj;
};

/**
 * @param obj
 * @param fn (item, key) -> (newValue)
 * @return object
 * */
exports.objMap = function (obj, fn) {
	var newObj = {};
	if (obj && fn) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				newObj[key] = fn(obj[key], key, obj);
			}
		}
	}
	return newObj;
};

/**
 * @param obj
 * @param fn (accumulated, item, key) -> (newAccumulatedValue)
 * @param initialValue
 * */
exports.objReduce = function (obj, fn, initialValue) {
	var value = initialValue;

	if (obj && fn) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				value = fn(value, obj[key], key, obj);
			}
		}
	}
	return value;
};
