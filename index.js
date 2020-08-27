'use strict';

/*
 * This file exports the app that is used by the server to expose the routes.
 * And make the routes visible.
 */

/***********************************
 **** node module defined here *****
 ***********************************/
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const cors = require('cors');
const cookieParser = require('cookie-parser');

const { errorHandler } = require('./utils');
const routes = require('./routes');

const fs = require('fs');
const dir = './uploads';

//mongodb file connection path
require('./db_mongodb');

//Create upload dir if not exist
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}
const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.use(cors());
app.use(
	bodyParser.json({
		limit: '50mb',
		extended: true
	})
);
app.use(
	bodyParser.urlencoded({
		limit: '50mb',
		extended: true
	})
);
app.use(logger('dev'));
app.use(cookieParser());

// This is to check if the service is online or not
app.use('/ping', function(req, res) {
	res.json({
		reply: 'pong'
	});
	res.end();
});

//Mount the routes
app.use('/v1', routes);
app.use(errorHandler);

app.listen(port, () => {
	console.log('\x1b[32m%s\x1b[0m', `The server is listening on http://${host}:${port}`);
});

module.exports = app;
