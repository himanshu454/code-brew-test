'use strict';

const Models = require('../models');

let adminService = {};

adminService.getAdmin = async (criteria, projection, options) => {
	const data = await Models.admin.findOne(criteria, projection, options);
	return data;
};

adminService.getStation = async (criteria, projection, options) => {
	const data = await Models.user.findOne(criteria, projection, options);
	return data;
};

adminService.addStation = async payload => {
	const data = await new Models.user(payload).save();
	return data;
};

module.exports = adminService;
