'use strict';

const Models = require('../models');
const { pagination } = require('../utils/constants');

let bookingService = {};

bookingService.addBooking = async payload => {
	const data = await new Models.bookingModel(payload).save();
	return data;
};
bookingService.updateBooking = async (criteria, projection, options) => {
	const data = await Models.bookingModel.findOneAndUpdate(criteria, projection, options);
	return data;
};

bookingService.getBookings = async (stationId, queryData) => {
	let pageNo = queryData.pageNo || pagination.default_pageNo;
	let limit = queryData.limit || pagination.default_limit;
	let query = [
		{
			$match: {
				fuelStationId: stationId,
				status: queryData.status
			}
		},
		{
			$lookup: {
				from: 'users',
				let: { isBlocked: false, isDeleted: false, userId: '$customerId' },
				pipeline: [
					{
						$match: {
							$expr: { $and: [{ $eq: ['$isBlocked', '$$isBlocked'] }, { $and: [{ $eq: ['$isDeleted', '$$isDeleted'] }, { $eq: ['$_id', '$$userId'] }] }] }
						}
					},
					{ $project: { createdAt: 0, updatedAt: 0, __v: 0, _id: 0, password: 0, isBlocked: 0, isDeleted: 0, availableFuels: 0, fuelStationLocation: 0, role: 0 } }
				],
				as: 'customerDetails'
			}
		},
		{
			$unwind: { path: '$customerDetails', preserveNullAndEmptyArrays: true }
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
				updatedAt: 0
			}
		}
	];
	let data = await Models.bookingModel.aggregate(query);
	return data;
};
module.exports = bookingService;
