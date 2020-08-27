'use strict';

const validation = require('./validation');
const { adminController, userController } = require('./controllers');
const { auth } = require('./utils');
const { formData } = require('./lib');

const express = require('express');
const router = express.Router();
const validator = require('express-joi-validation').createValidator({ passError: true });

/*****************************************************************
 ************************ADMIN ROUTES*****************************
 *****************************************************************/

/************************************
 * This route is used for admin login
 ***********************************/
router.post('/admin/login', validator.body(validation.adminLogin), auth.verifyApiKey, adminController.login);
/********************************************
 * This route is used for adding fuel station
 ********************************************/
router.post('/admin/addFuelStation', validator.headers(validation.headers, { joi: { convert: true, allowUnknown: true } }), validator.body(validation.addFuelStation), auth.verifyApiKey, auth.admin, adminController.addFuelStation);

/*****************************************************************
 ************************USER ROUTES*****************************
 *****************************************************************/

/*******************************************************
 * This route is used to register user with fuel station
 ******************************************************/
router.post('/user/newUser', validator.body(validation.newUser), auth.verifyApiKey, userController.registerNewUser);
/*******************************************************
 * This route is used for User login
 ******************************************************/
router.post('/user/login', validator.body(validation.userLogin), auth.verifyApiKey, userController.login);
/*******************************************************
 * This route is used to get nearest pumps
 ******************************************************/
router.get('/user/nearestPumps', validator.headers(validation.headers, { joi: { convert: true, allowUnknown: true } }), validator.query(validation.nearestPumps), auth.verifyApiKey, auth.user, userController.getNearestPumps);
/*******************************************************
 * This route is used to register booking request
 ******************************************************/
router.post('/user/booking', validator.headers(validation.headers, { joi: { convert: true, allowUnknown: true } }), validator.body(validation.booking), auth.verifyApiKey, auth.user, userController.registerRequest);

/*****************************************************************
 **********************FUEL STATION ROUTES************************
 *****************************************************************/

/*******************************************************
 * This route is used to get fuel bookings
 ******************************************************/
router.get('/fuelStation/bookings', validator.headers(validation.headers, { joi: { convert: true, allowUnknown: true } }), validator.query(validation.getBookings), auth.verifyApiKey, auth.user, userController.getBookings);
/*******************************************************
 * This route is used to mark request confirmed by owner
 ******************************************************/
router.post('/fuelStation/markRequest', validator.headers(validation.headers, { joi: { convert: true, allowUnknown: true } }), validator.body(validation.markRequest), auth.verifyApiKey, auth.user, userController.markRequestByOwner);

/*****************************************************************
 **********************UPLOAD FILE ROUTE************************
 *****************************************************************/

router.post('/uploadFile', validator.body(validation.uploadFile), auth.verifyApiKey, formData.uploadFile, userController.uploadFile);
module.exports = router;
