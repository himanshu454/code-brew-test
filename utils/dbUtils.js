const models = require('../models/index');
const { createHash } = require('./helpers');

let dbUtils = {};

/**
 * function to create admin.
 */
dbUtils.createAdmin = async () => {
	//let isAdminExists = await models.admin.countDocuments();
	let adminDetails = {
		email: process.env.ADMIN_EMAIL || 'admin454@gmail.com',
		password: createHash(process.env.ADMIN_PASSWORD || 'password')
	};
	let options = {
		upsert: true,
		new: true
	};
	await models.admin.findOneAndUpdate({ email: adminDetails.email }, { $set: { password: adminDetails.password } }, options);
};

module.exports = dbUtils;
