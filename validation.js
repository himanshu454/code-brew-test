'use strict';

const Joi = require('@hapi/joi');
const Readable = require('stream').Readable;

const { fuel_types } = require('./utils/constants');

const strictChecking = {
	allowUnknownBody: false,
	allowUnknownHeaders: true,
	allowUnknownQuery: false,
	allowUnknownParams: false,
	allowUnknownCookies: false
};

const adminLogin = Joi.object({
	apiKey: Joi.string()
		.required()
		.description('API KEY'),
	email: Joi.string()
		.required()
		.description('Admin email'),
	password: Joi.string()
		.required()
		.description('Admin password')
});

const addFuelStation = Joi.object({
	apiKey: Joi.string()
		.required()
		.description('API KEY'),
	email: Joi.string()
		.required()
		.description('Email address of fuel station or station owner'),
	password: Joi.string()
		.required()
		.description('Fuel Station or station owner password.'),
	city: Joi.string()
		.required()
		.description('Fuel Station city.'),
	country: Joi.string()
		.required()
		.description('Fuel Station country.'),
	fuelStationLocation: {
		type: Joi.string()
			.required()
			.valid('Point')
			.description('Type of location.'),
		coordinates: Joi.array()
			.items(Joi.number())
			.min(2)
			.max(2)
			.description('Coordinates of location.')
	},
	availableFuels: Joi.array()
		.unique()
		.items(Joi.number().allow(1, 2, 3))
		.min(1)
		.description('Required fuels. 1 for diesel,2 for petrol, 3 for cng')
});

const headers = Joi.object({
	authorization: Joi.string()
		.required()
		.description('JWT token')
});

const newUser = Joi.object({
	apiKey: Joi.string()
		.required()
		.description('API KEY'),
	name: Joi.string()
		.required()
		.description('Name of User'),
	email: Joi.string()
		.required()
		.description('Email of User'),
	password: Joi.string()
		.required()
		.description('User password.'),
	city: Joi.string()
		.required()
		.description('User city.'),
	country: Joi.string()
		.required()
		.description('User country.')
});

const userLogin = Joi.object({
	apiKey: Joi.string()
		.required()
		.description('API KEY'),
	email: Joi.string()
		.required()
		.description('User email'),
	password: Joi.string()
		.required()
		.description('user password')
});

const nearestPumps = Joi.object({
	apiKey: Joi.string()
		.required()
		.description('API KEY'),
	longitude: Joi.number()
		.required()
		.description('longitude of location'),
	latitude: Joi.number()
		.required()
		.description('latitude of location'),
	pageNo: Joi.number()
		.optional()
		.description('page no.'),
	limit: Joi.number()
		.optional()
		.description('Number of documents to get.')
});

const booking = Joi.object({
	apiKey: Joi.string()
		.required()
		.description('API KEY'),
	vehicles: Joi.array().items(
		Joi.object({
			vehicleNumber: Joi.string()
				.required()
				.description('Vehicle number.'),
			fuelType: Joi.number()
				.allow(fuel_types.diesel, fuel_types.petrol, fuel_types.cng)
				.required()
				.description('Fuel type of vehicle')
		})
			.required()
			.description('Vehiccles infos.')
	),
	fuelStationId: Joi.string()
		.required()
		.description('Fuel station ID.')
});

const getBookings = Joi.object({
	apiKey: Joi.string()
		.required()
		.description('API KEY'),
	pageNo: Joi.number()
		.optional()
		.description('page no.'),
	limit: Joi.number()
		.optional()
		.description('Number of documents to get'),
	status: Joi.string()
		.allow('REQUESTED', 'CONFIRMED', 'COMPLETED')
		.default('REQUESTED')
});

const markRequest = Joi.object({
	apiKey: Joi.string()
		.required()
		.description('API KEY'),
	bookingId: Joi.string()
		.required()
		.description('Booking ID')
});

const uploadFile = Joi.object({
	apiKey: Joi.string()
		.required()
		.description('API KEY')
});

module.exports = {
	adminLogin,
	headers,
	strictChecking,
	addFuelStation,
	newUser,
	userLogin,
	nearestPumps,
	booking,
	getBookings,
	markRequest,
	uploadFile
};
