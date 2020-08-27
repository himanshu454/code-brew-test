'use strict';

require('dotenv').config();

const Services = require('../services');

const { helpers, auth, constants } = require('../utils');

let adminController = {};

/*******************************************
 ********** Admin login function************
 *******************************************/
adminController.login = async (req, res) => {
	let resData;
	try {
		//Hash password
		let hashPassword = helpers.createHash(req.body.password);
		//check if email and password are correct
		let criteria = {
			email: req.body.email,
			password: hashPassword
		};
		let projection = {};
		let options = {
			lean: true
		};
		let admin = await Services.adminService.getAdmin(criteria, projection, options);
		if (!admin) {
			throw new Error('Wrong email password combination !!');
		}
		//Sign JWT Token
		let data = {};
		data['id'] = admin._id;
		data['email'] = admin.email;
		let token = await auth.signToken(data);
		resData = {
			id: admin._id,
			token: token
		};
		res.status(200).json({
			status: 'success',
			data: resData
		});
	} catch (err) {
		console.log('Error in admin login: ', err);
		return res.status(400).json({
			status: 'failure',
			message: err.message
		});
	}
};
/*******************************************
 ********** Function to add station*********
 *******************************************/
adminController.addFuelStation = async (req, res) => {
	try {
		//Check if station owner exists or not
		let criteria = {
			email: req.body.email.toLowerCase(),
			role: constants.user_roles.station_owner
		};
		let projection = {};
		let options = {
			lean: true
		};
		let isFuelStationExist = await Services.adminService.getStation(criteria, projection, options);
		if (isFuelStationExist) {
			throw new Error('Fuel station already exist');
		}
		let obtToSave = req.body;
		//Station Owner
		obtToSave.role = constants.user_roles.station_owner;
		obtToSave.password = helpers.createHash(req.body.password);
		await Services.adminService.addStation(obtToSave);
		res.status(200).json({
			status: 'success',
			message: 'Fuel Station added successfully'
		});
	} catch (err) {
		console.log('Error in adding fuel station: ', err);
		return res.status(400).json({
			status: 'failure',
			message: err.message
		});
	}
};

module.exports = adminController;
