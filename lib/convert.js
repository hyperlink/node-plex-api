"use strict";

const _ = require('lodash');

function convertObject (data, rootKey) {
	let result = {};
	if (rootKey) {
		result._elementType = rootKey;
	}
	for (let key in data) {
		if (key === 'size' && rootKey != 'Part') {
			continue;
		}
		let value = data[key];
		let convertedValue = convertValue(value, key);

		if (!rootKey) {
			result = convertedValue;
		} else {
			if (key[0] === key[0].toUpperCase()) {
				if ('_children' in result) {
					result._children = _.concat(result._children, convertedValue);
				} else {
					result._children = convertedValue;
				}
			} else {
				result[key] = convertedValue;
			}
		}
	}
	return result;
}

function convertArray (arr, key) {
	const converted = arr.map(function (item) {
		let converted = convertValue(item, key);
		converted._elementType = key;
		return converted;
	});
	return converted;
}

function convertValue (value, key) {
	if (_.isBoolean(value)) {
		return value === true ? '1' : '0';
	}

	if (key === 'id') {
		return value;
	}

	if (_.isArray(value)) {
		return convertArray(value, key);
	}

	if (_.isObject(value)) {
		return convertObject(value, key);
	}

	return value;
}

function convertData (data) {
	if (data && !('_children' in data)) {
		return convertObject(data);
	}
	return data;
}

module.exports = convertData;
