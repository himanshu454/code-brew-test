'use strict';

const Models = require('../models');
const { user_roles, pagination } = require('../utils/constants');

let userService = {};

userService.getUser = async (criteria, projection, options) => {
	const data = await Models.user.findOne(criteria, projection, options);
	return data;
};

userService.addNewUser = async payload => {
	const data = await new Models.user(payload).save();
	return data;
};

userService.getNearestPumps = async queryData => {
	let longitude = queryData.longitude;
	let latitude = queryData.latitude;
	let pageNo = queryData.pageNo || pagination.default_pageNo;
	let limit = queryData.limit || pagination.default_limit;
	let query = [
		{
			$geoNear: {
				near: { type: 'Point', coordinates: [longitude, latitude] },
				distanceField: 'distance',
				distanceMultiplier: 0.001,
				spherical: true,
				query: { role: user_roles.station_owner, isDeleted: false, isBlocked: false }
			}
		},
		{
			$sort: { distance: 1 }
		},
		{
			$skip: (pageNo - 1) * limit
		},
		{
			$limit: limit
		},
		{
			$project: {
				__v: 0,
				createdAt: 0,
				updatedAt: 0,
				password: 0,
				role: 0,
				isDeleted: false,
				isBlocked: false
			}
		}
	];
	let data = await Models.user.aggregate(query);
	return data;
};

module.exports = userService;
