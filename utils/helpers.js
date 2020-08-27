'use strict';

const crypto = require('crypto');

//For hashing password
const createHash = str => {
	if (typeof str === 'string' && str.length > 0) {
		const hash = crypto
			.createHmac('sha256', process.env.HASHING_SECRET_KEY || 'fuel_booking@!@#$%%')
			.update(str)
			.digest('hex');
		return hash;
	} else {
		return false;
	}
};

const decodeRole = role => {
	return new Promise((resolve, reject) => {
		switch (role) {
			case 0:
				role = 'USER';
				break;
			case 1:
				role = 'OWNER';
				break;
			default:
				role = -1;
		}
		if (role == -1) {
			reject(new Error('Wrong Role Passed'));
		} else {
			resolve(role);
		}
	});
};

module.exports = {
	createHash,
	decodeRole
};
