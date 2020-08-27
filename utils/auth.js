'use strict';

require('dotenv').config();

const Services = require('../services');

const jwt = require('jsonwebtoken');

let auth = {};

auth.verifyApiKey = async (req, res, next) => {
	if (req.query && req.query.apiKey && req.query.apiKey === (process.env.API_KEY || 'fuel_booking!@#$%^&*&^&**^$')) {
		next();
	} else if (req.body && req.body.apiKey && req.body.apiKey === (process.env.API_KEY || 'fuel_booking!@#$%^&*&^&**^$')) {
		next();
	} else {
		res.status(401).json({
			success: 'failure',
			message: 'Invalid Api key'
		});
	}
};
//Sign jwt token
auth.signToken = async data => {
	const secret = process.env.SECRET || 'fuelbooking!@#!@#!!!12#!#!';
	const token = jwt.sign(data, secret, {
		expiresIn: '72h'
	});
	if (!token) {
		throw new Error('Unable to sign token !!');
	} else {
		return token;
	}
};

auth.getToken = req => {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		return req.headers.authorization.split(' ')[1];
	} else if (req.query && req.query.token) {
		return req.query.token;
	} else if (req.cookies && req.cookies.token) {
		return req.cookies.token;
	}
	return null;
};

/******** Verify Admin Token nd get details *********/
auth.admin = async (req, res, next) => {
	const token = auth.getToken(req);
	if (!token) {
		res.status(401).json({
			success: 'failure',
			message: 'Unauthorised access'
		});
	} else {
		try {
			jwt.verify(token, process.env.SECRET || 'fuelbooking!@#!@#!!!12#!#!', async (err, decoded) => {
				console.log('Error while verifying jwt token>>>>>>>>', err);
				if (err) {
					return res.status(401).json({
						success: 'failure',
						message: 'Unauthorised access or token expired'
					});
				} else {
					let criteria = {
						_id: decoded.id
					};
					let projection = {};
					let options = {
						lean: true
					};
					let admin = await Services.adminService.getAdmin(criteria, projection, options);
					if (!admin) {
						return res.status(401).json({
							success: 'failure',
							message: 'Incorrect token'
						});
					} else {
						delete admin.password;
						admin.token = token;
						req.admin = admin;
						next();
					}
				}
			});
		} catch (err) {
			res.status(401).json({
				success: false,
				message: 'Unable to authenticate admin',
				data: {}
			});
		}
	}
};

/******** Verify Admin Token nd get details *********/
auth.user = async (req, res, next) => {
	const token = auth.getToken(req);
	if (!token) {
		res.status(401).json({
			success: 'failure',
			message: 'Unauthorised access'
		});
	} else {
		try {
			jwt.verify(token, process.env.SECRET || 'fuelbooking!@#!@#!!!12#!#!', async (err, decoded) => {
				console.log('Error while verifying jwt token>>>>>>>>', err);
				if (err) {
					return res.status(401).json({
						success: 'failure',
						message: 'Unauthorised access or token expired'
					});
				} else {
					let criteria = {
						_id: decoded.id
					};
					let projection = {};
					let options = {
						lean: true
					};
					let user = await Services.userService.getUser(criteria, projection, options);
					if (!user) {
						return res.status(401).json({
							success: 'failure',
							message: 'Incorrect token'
						});
					} else {
						delete user.password;
						user.token = token;
						req.user = user;
						next();
					}
				}
			});
		} catch (err) {
			res.status(401).json({
				success: false,
				message: 'Unable to authenticate user',
				data: {}
			});
		}
	}
};
module.exports = auth;
