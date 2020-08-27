'use strict';

require('dotenv').config();

const Services = require('../services');
const { helpers, auth, constants } = require('../utils');
const { formData } = require('../lib');

const fs = require('fs');

let userController = {};

/*******************************************
 ******Function for register a User*********
 *******************************************/
userController.registerNewUser = async (req, res) => {
	try {
		//Check if user exists
		let criteria = {
			email: req.body.email,
			role: constants.user_roles.user,
			isDeleted: false,
			isBlocked: false
		};
		let projection = {
			isDeleted: 0,
			createdAt: 0,
			updatedAt: 0
		};
		let options = {
			lean: true
		};
		let isUserExist = await Services.userService.getUser(criteria, projection, options);
		if (isUserExist) {
			throw new Error('User already exists');
		}
		let objToSave = req.body;
		objToSave.role = constants.user_roles.user;
		//Hash Password
		objToSave.password = helpers.createHash(req.body.password);
		//Register user
		await Services.userService.addNewUser(objToSave);
		res.status(200).json({
			status: 'success',
			message: 'User Registered Successfully'
		});
	} catch (err) {
		console.log('Error in register new user api: ', err);
		return res.status(400).json({
			status: 'failure',
			message: err.message
		});
	}
};

/*******************************************
 ********** User login function************
 *******************************************/
userController.login = async (req, res) => {
	let resData;
	try {
		//Hash password
		let hashPassword = helpers.createHash(req.body.password);
		//check if email and password are correct
		let criteria = {
			email: req.body.email,
			password: hashPassword,
			isBlocked: false
		};
		let projection = {
			isDeleted: 0,
			createdAt: 0,
			updatedAt: 0
		};
		let options = {
			lean: true
		};
		let userExist = await Services.userService.getUser(criteria, projection, options);
		if (!userExist) {
			throw new Error('Wrong email password combination !!');
		}
		//Decode Role
		let role = await helpers.decodeRole(userExist.role);
		//Sign JWT Token
		let data = {};
		data['id'] = userExist._id;
		data['role'] = role;
		let token = await auth.signToken(data);
		resData = {
			id: userExist._id,
			token: token,
			role: role
		};
		res.status(200).json({
			status: 'success',
			data: resData
		});
	} catch (err) {
		console.log('Error in user login api: ', err);
		return res.status(400).json({
			status: 'failure',
			message: err.message
		});
	}
};

/**********************************************************
 **********Function to get nearby fuel stations************
 **********************************************************/
userController.getNearestPumps = async (req, res) => {
	try {
		let fuelStations = await Services.userService.getNearestPumps(req.query);
		res.status(200).json({
			status: 'success',
			data: fuelStations
		});
	} catch (err) {
		console.log('Error in get nearest pumps api: ', err);
		return res.status(400).json({
			status: 'failure',
			message: err.message
		});
	}
};

/**********************************************************
 **********Function to book fuel filling appointment************
 **********************************************************/
userController.registerRequest = async (req, res) => {
	let fuelStationId = req.body.fuelStationId;
	try {
		//Check if fuel station exists
		let criteria = {
			_id: fuelStationId,
			role: constants.user_roles.station_owner,
			isBlocked: false,
			isDeleted: false
		};
		let station = await Services.userService.getUser(criteria, {}, {});
		if (!station) {
			throw new Error('Invalid Fuel station Id');
		}
		let objToSave = req.body;
		objToSave.customerId = req.user._id;
		//Create booking request
		await Services.bookingService.addBooking(objToSave);
		res.status(200).json({
			status: 'success',
			message: 'Successfully sent booking request to fuel station'
		});
	} catch (err) {
		console.log('Error in booking api: ', err);
		return res.status(400).json({
			status: 'failure',
			message: err.message
		});
	}
};

/**********************************************************
 **********Function to get Bookings************
 **********************************************************/
userController.getBookings = async (req, res) => {
	let stationId = req.user._id;
	try {
		//Check if fuel station exists
		let criteria = {
			_id: stationId,
			role: constants.user_roles.station_owner,
			isBlocked: false,
			isDeleted: false
		};
		let station = await Services.userService.getUser(criteria, {}, {});
		if (!station) {
			throw new Error('Invalid Fuel station Id');
		}
		let bookings = await Services.bookingService.getBookings(stationId, req.query);
		res.status(200).json({
			status: 'success',
			data: bookings
		});
	} catch (err) {
		console.log('Error in get bookings api: ', err);
		return res.status(400).json({
			status: 'failure',
			message: err.message
		});
	}
};

/**********************************************************
 *****Function to update status of booking by owner********
 **********************************************************/
userController.markRequestByOwner = async (req, res) => {
	let stationId = req.user._id;
	try {
		//Update booking status
		let criteria = {
			fuelStationId: stationId,
			status: 'REQUESTED'
		};
		let dataToSet = {
			status: 'CONFIRMED'
		};
		let options = {
			lean: true,
			new: true
		};
		let updateStatus = await Services.bookingService.updateBooking(criteria, dataToSet, options);
		if (!updateStatus) {
			throw new Error('Invalid Booking ID');
		}
		res.status(200).json({
			status: 'success',
			message: 'Booking Status Update Successfully'
		});
	} catch (err) {
		console.log('Error in mark request api: ', err);
		return res.status(400).json({
			status: 'failure',
			message: err.message
		});
	}
};
/**********************************************************
 ***************Function to upload file on local***********
 **********************************************************/
userController.uploadFile = async (req, res) => {
	console.log('Resq', req.file);
	try {
		res.status(200).json({
			status: 'success',
			message: 'File Uploaded sucessfully'
		});
	} catch (err) {
		console.log('Error in upload file api: ', err);
		return res.status(400).json({
			status: 'failure',
			message: err.message
		});
	}
};
module.exports = userController;
