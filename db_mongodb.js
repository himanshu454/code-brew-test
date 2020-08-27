'use strict';

require('dotenv').config();

// Bring Mongoose into the app
const mongoose = require('mongoose');

const { dbUtils } = require('./utils');

// Build the connection string
const dbURI = process.env.MONGOURI || 'mongodb://localhost/fuelbooking';

const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
};

// Create the database connection
mongoose.connect(dbURI, options, err => {
	if (err) {
		console.log('DB Error: ', err);
		throw err;
	} else {
		console.log('MongoDB Connected');
	}
});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', async function() {
	console.log('Mongoose default connection open to ' + dbURI);
	await dbUtils.createAdmin();
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
	console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose default connection disconnected');
});
